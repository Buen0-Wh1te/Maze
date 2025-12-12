import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Tile } from "../components/Tile";
import { PlayerSprite } from "../components/PlayerSprite";
import { Inventory } from "../components/Inventory";
import { BattleModal } from "../components/BattleModal";
import { useGame } from "../hooks/useGame";
import { useGameState } from "../hooks/useGameState";
import { useGridScaling } from "../hooks/useGridScaling";
import { usePlayerMovement } from "../hooks/usePlayerMovement";
import {
  isAdjacentToRevealed,
  isAdjacentToPlayer,
  getTileNeighbors,
} from "../utils/tileLogic";
import {
  calculateTileSprite,
  setTilesetCacheUpdateCallback,
} from "../utils/tileset";
import { handleTileInteraction } from "../utils/tileInteractions";
import {
  TILE_SIZE,
  TILE_TYPES,
  GRADIENT_GOLD,
  BACKGROUND_STYLE,
} from "../constants/config";
import backgroundImage from "../assets/backgrounds/game.jpg";

export function Game() {
  const { levelId } = useParams<{ levelId: string }>();
  const { pseudo } = useGame();
  const {
    level,
    tiles,
    loading,
    error,
    playerPos,
    moves,
    revealTile,
    clearTile,
    movePlayer,
    checkVictory,
    handleEndGame,
    retryLevel,
    inventory,
    combat,
  } = useGameState(levelId ? Number(levelId) : undefined, pseudo);

  const gridScale = useGridScaling(tiles);
  const [, forceUpdate] = useState({});
  const playerMovement = usePlayerMovement();
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    setTilesetCacheUpdateCallback(() => {
      forceUpdate({});
    });
  }, []);

  const handleTileClick = async (row: number, col: number) => {
    if (!playerPos) return;
    if (!isAdjacentToRevealed(row, col, tiles)) return;
    if (!isAdjacentToPlayer(row, col, playerPos)) return;

    const updated = revealTile(row, col);
    const tile = updated[row][col];

    const interaction = handleTileInteraction(
      tile.type,
      tile.content,
      level,
      inventory.hasKey,
      inventory.addKey,
      inventory.setWeapon,
      inventory.addItem,
      combat.startBattle
    );

    if (!interaction.canMove) return;

    if (interaction.shouldClearTile) {
      clearTile(row, col);
    }

    const oldPos = { row: playerPos.row, col: playerPos.col };
    const newPos = { row, col };

    movePlayer(row, col);
    playerMovement.startMovement(oldPos, newPos);

    await checkVictory(row, col);
  };

  useEffect(() => {
    const movePlayer = (row: number, col: number) => {
      handleTileClick(row, col);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerPos) return;

      let targetRow = playerPos.row;
      let targetCol = playerPos.col;

      switch (e.key) {
        case "ArrowUp":
          targetRow -= 1;
          break;
        case "ArrowDown":
          targetRow += 1;
          break;
        case "ArrowLeft":
          targetCol -= 1;
          break;
        case "ArrowRight":
          targetCol += 1;
          break;
        default:
          return;
      }

      if (targetRow < 0 || targetRow >= tiles.length || targetCol < 0 || targetCol >= tiles[0].length) {
        return;
      }

      movePlayer(targetRow, targetCol);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (loading) {
    return (
      <div
        className="text-white flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          ...BACKGROUND_STYLE,
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded">
          <p className="text-xl">Loading level...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-white flex flex-col items-center justify-center min-h-screen gap-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          ...BACKGROUND_STYLE,
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded">
          <p className="text-xl text-red-400">{error}</p>
        </div>
        <Button onClick={retryLevel}>Retry</Button>
      </div>
    );
  }

  const tilesRevealed = tiles.flat().filter((tile) => tile.revealed).length;

  return (
    <div
      className="text-white flex flex-col items-center min-h-screen p-8 gap-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        ...BACKGROUND_STYLE,
      }}
    >
      <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg">
        <h1
          className="text-5xl font-bold text-center"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: GRADIENT_GOLD,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {level?.name}
        </h1>
      </div>
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded flex gap-6 text-sm">
        <span className="text-gray-300">
          Playing as: <span className="text-pink-300 font-bold">{pseudo}</span>
        </span>
        <span className="text-gray-300">
          Moves: <span className="text-white font-bold">{moves}</span>
        </span>
        <span className="text-gray-300">
          Tiles Revealed:{" "}
          <span className="text-white font-bold">{tilesRevealed}</span>
        </span>
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`px-3 py-1 rounded text-xs font-bold transition-colors hidden ${
            debugMode
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          {debugMode ? "DEBUG: ON" : "DEBUG: OFF"}
        </button>
      </div>
      <Inventory inventory={inventory.inventory} />
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div
          className="flex flex-col gap-0 shadow-2xl"
          style={{
            width: `${tiles[0]?.length * TILE_SIZE}px`,
            height: `${tiles.length * TILE_SIZE}px`,
            transform: `scale(${gridScale})`,
            transformOrigin: "center",
            imageRendering: "pixelated",
          }}
        >
          {tiles.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-0"
              style={{ height: `${TILE_SIZE}px` }}
            >
              {row.map((tile, colIndex) => {
                const neighbors = getTileNeighbors(rowIndex, colIndex, tiles);
                const tileType =
                  tile.type === TILE_TYPES.WALL ? "wall" : "path";
                const sprite = calculateTileSprite(tileType, neighbors);
                const isPlayerTile = playerPos?.row === rowIndex && playerPos?.col === colIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative"
                    style={{
                      width: `${TILE_SIZE}px`,
                      height: `${TILE_SIZE}px`,
                    }}
                  >
                    <Tile
                      type={tile.type}
                      revealed={tile.revealed}
                      isPlayer={isPlayerTile}
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                      spriteX={sprite.x}
                      spriteY={sprite.y}
                      debugMode={debugMode}
                    />
                    {isPlayerTile && (
                      <PlayerSprite
                        isMoving={playerMovement.isMoving}
                        direction={playerMovement.direction}
                        size={TILE_SIZE}
                        transitionOffset={playerMovement.transitionOffset}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleEndGame}>End Game</Button>
      {combat.isBattleActive && combat.currentEnemy && (
        <BattleModal
          enemy={combat.currentEnemy}
          hasWeapon={inventory.hasWeapon()}
          onFight={() => {
            const result = combat.fight(inventory.hasWeapon());
            combat.endBattle();
            if (result === "defeat") {
              handleEndGame();
            }
          }}
          onFlee={() => {
            combat.endBattle();
          }}
        />
      )}
    </div>
  );
}
