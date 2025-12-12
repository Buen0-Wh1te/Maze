import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Tile } from "../components/Tile";
import { PlayerSprite } from "../components/PlayerSprite";
import { useGame } from "../hooks/useGame";
import { useGameState } from "../hooks/useGameState";
import { useGridScaling } from "../hooks/useGridScaling";
import { isAdjacentToRevealed, isAdjacentToPlayer, getTileNeighbors } from "../utils/tileLogic";
import { calculateTileSprite, setTilesetCacheUpdateCallback } from "../utils/tileset";
import { TILE_SIZE, TILE_TYPES, GRADIENT_GOLD, BACKGROUND_STYLE } from "../constants/config";
import backgroundImage from "../assets/backgrounds/game.jpg";

type Direction = 'left' | 'right';

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
    movePlayer,
    checkVictory,
    handleEndGame,
    retryLevel,
  } = useGameState(levelId ? Number(levelId) : undefined, pseudo);

  const gridScale = useGridScaling(tiles);
  const [, forceUpdate] = useState({});
  const [playerDirection, setPlayerDirection] = useState<Direction>('right');
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [transitionOffset, setTransitionOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setTilesetCacheUpdateCallback(() => {
      forceUpdate({});
    });
  }, []);

  const getDirection = (fromCol: number, toCol: number): Direction => {
    if (toCol < fromCol) return 'left';
    return 'right';
  };

  const handleTileClick = async (row: number, col: number) => {
    if (!playerPos) return;
    if (!isAdjacentToRevealed(row, col, tiles)) return;
    if (!isAdjacentToPlayer(row, col, playerPos)) return;

    const updated = revealTile(row, col);

    if (updated[row][col].type === TILE_TYPES.WALL) return;

    // Update direction (only for horizontal movement)
    if (col !== playerPos.col) {
      const direction = getDirection(playerPos.col, col);
      setPlayerDirection(direction);
    }

    // Calculate offset from old position to new position
    const offsetX = (playerPos.col - col) * TILE_SIZE;
    const offsetY = (playerPos.row - row) * TILE_SIZE;

    // Move player position immediately
    movePlayer(row, col);

    // Set initial offset (sprite starts at old position)
    setTransitionOffset({ x: offsetX, y: offsetY });
    setIsPlayerMoving(true);

    // Animate to new position on next frame
    requestAnimationFrame(() => {
      setTransitionOffset({ x: 0, y: 0 });
    });

    // Reset movement state after animation
    setTimeout(() => {
      setIsPlayerMoving(false);
    }, 600);

    await checkVictory(row, col);
  };

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
          Tiles Revealed: <span className="text-white font-bold">{tilesRevealed}</span>
        </span>
      </div>
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
            <div key={rowIndex} className="flex gap-0" style={{ height: `${TILE_SIZE}px` }}>
              {row.map((tile, colIndex) => {
                const neighbors = getTileNeighbors(rowIndex, colIndex, tiles);
                const tileType = tile.type === TILE_TYPES.WALL ? "wall" : "path";
                const sprite = calculateTileSprite(tileType, neighbors);
                const isPlayerTile = playerPos?.row === rowIndex && playerPos?.col === colIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative"
                    style={{ width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px` }}
                  >
                    <Tile
                      type={tile.type}
                      revealed={tile.revealed}
                      isPlayer={isPlayerTile}
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                      spriteX={sprite.x}
                      spriteY={sprite.y}
                    />
                    {isPlayerTile && (
                      <PlayerSprite
                        isMoving={isPlayerMoving}
                        direction={playerDirection}
                        size={TILE_SIZE}
                        transitionOffset={transitionOffset}
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
    </div>
  );
}
