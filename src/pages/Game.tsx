import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Tile } from "../components/Tile";
import { useGame } from "../hooks/useGame";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";
import type { TileState, TileType } from "../types/game";
import { calculateTileSprite, calculateTileBitmask } from "../utils/tileset";
import backgroundImage from "../assets/backgrounds/game.jpg";

export function Game() {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const { pseudo } = useGame();
  const [level, setLevel] = useState<Level | null>(null);
  const [tiles, setTiles] = useState<TileState[][]>([]);
  const [loading, setLoading] = useState(true);
  const [playerPos, setPlayerPos] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gridScale, setGridScale] = useState(1);

  useEffect(() => {
    if (levelId) {
      loadLevel(Number(levelId));
    }
  }, [levelId]);

  useEffect(() => {
    if (!loading && !startTime) {
      setStartTime(Date.now());
    }
  }, [loading, startTime]);

  useEffect(() => {
    if (tiles.length > 0) {
      const calculateScale = () => {
        const gridWidth = tiles[0].length * 32;
        const gridHeight = tiles.length * 32;
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight - 280;

        const scaleX = maxWidth / gridWidth;
        const scaleY = maxHeight / gridHeight;
        const scale = Math.min(scaleX, scaleY, 3); // Max 3x scale

        setGridScale(scale);
      };

      calculateScale();
      window.addEventListener("resize", calculateScale);
      return () => window.removeEventListener("resize", calculateScale);
    }
  }, [tiles]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const levelData = await fetchLevel(levelId);
      setLevel(levelData);

      const initialTiles: TileState[][] = levelData.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          position: { row: rowIndex, col: colIndex },
          type: cell as TileType,
          content: cell,
          revealed:
            rowIndex === levelData.start.row &&
            colIndex === levelData.start.col,
          enemy: null,
        }))
      );

      setTiles(initialTiles);
      setPlayerPos(levelData.start);
    } catch (error) {
      console.error("Failed to load level:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    const tilesRevealed = tiles.flat().filter(tile => tile.revealed).length;
    const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    return {
      pseudo,
      tilesRevealed,
      moves,
      timeElapsed,
      totalScore: tilesRevealed * 10 - moves * 2 - timeElapsed,
    };
  };

  const isAdjacentToRevealed = (row: number, col: number): boolean => {
    const neighbors = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    return neighbors.some(
      (neighbor) =>
        neighbor.row >= 0 &&
        neighbor.row < tiles.length &&
        neighbor.col >= 0 &&
        neighbor.col < tiles[0].length &&
        tiles[neighbor.row][neighbor.col].revealed
    );
  };

  const handleTileClick = (row: number, col: number) => {
    if (!playerPos) return;

    if (!isAdjacentToRevealed(row, col)) return;

    const isAdjacentToPlayer =
      (Math.abs(playerPos.row - row) === 1 && playerPos.col === col) ||
      (Math.abs(playerPos.col - col) === 1 && playerPos.row === row);

    if (!isAdjacentToPlayer) return;

    const updated = [...tiles];
    updated[row][col].revealed = true;
    setTiles(updated);

    // If it's a wall, just reveal it but don't move
    if (tiles[row][col].type === "W") return;

    // Move player onto the tile (only for non-walls)
    setPlayerPos({ row, col });
    setMoves(prev => prev + 1);

    if (updated[row][col].type === "E") {
      const score = calculateScore();
      navigate("/victory", { state: { score } });
    }
  };

  const handleEndGame = () => {
    const score = calculateScore();
    navigate("/score", { state: { score } });
  };

  const getTileNeighbors = (row: number, col: number) => {
    const isSameType = (r: number, c: number) => {
      if (r < 0 || r >= tiles.length || c < 0 || c >= tiles[0].length) {
        return false;
      }
      const currentTile = tiles[row][col].type;
      const neighborTile = tiles[r][c].type;

      // Both are paths (C, S, E, M, K, D, A, O) - paths connect to paths
      const pathTypes = ["C", "S", "E", "M", "K", "D", "A", "O"];
      const isCurrentPath = pathTypes.includes(currentTile);
      const isNeighborPath = pathTypes.includes(neighborTile);

      if (isCurrentPath && isNeighborPath) return true;

      // Both are walls - walls connect to walls
      if (currentTile === "W" && neighborTile === "W") return true;

      return false;
    };

    return {
      top: isSameType(row - 1, col),
      right: isSameType(row, col + 1),
      bottom: isSameType(row + 1, col),
      left: isSameType(row, col - 1),
      topLeft: isSameType(row - 1, col - 1),
      topRight: isSameType(row - 1, col + 1),
      bottomLeft: isSameType(row + 1, col - 1),
      bottomRight: isSameType(row + 1, col + 1),
    };
  };

  if (loading) {
    return (
      <div
        className="text-white flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded">
          <p className="text-xl">Loading level...</p>
        </div>
      </div>
    );
  }

  const tilesRevealed = tiles.flat().filter(tile => tile.revealed).length;

  return (
    <div
      className="text-white flex flex-col items-center min-h-screen p-8 gap-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg">
        <h1
          className="text-5xl font-bold text-center"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {level?.name}
        </h1>
      </div>
      <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded flex gap-6 text-sm">
        <span className="text-gray-300">Playing as: <span className="text-pink-300 font-bold">{pseudo}</span></span>
        <span className="text-gray-300">Moves: <span className="text-white font-bold">{moves}</span></span>
        <span className="text-gray-300">Tiles Revealed: <span className="text-white font-bold">{tilesRevealed}</span></span>
      </div>
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div
          className="flex flex-col gap-0 shadow-2xl"
          style={{
            width: `${tiles[0]?.length * 32}px`,
            height: `${tiles.length * 32}px`,
            transform: `scale(${gridScale})`,
            transformOrigin: "center",
            imageRendering: "pixelated",
          }}
        >
          {tiles.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-0" style={{ height: "32px" }}>
              {row.map((tile, colIndex) => {
                const neighbors = getTileNeighbors(rowIndex, colIndex);
                const tileType = tile.type === "W" ? "wall" : "path";
                const sprite = calculateTileSprite(tileType, neighbors);

                return (
                  <div key={`${rowIndex}-${colIndex}`} className="relative" style={{ width: "32px", height: "32px" }}>
                    <Tile
                      type={tile.type}
                      revealed={tile.revealed}
                      isPlayer={
                        playerPos?.row === rowIndex && playerPos?.col === colIndex
                      }
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                      spriteX={sprite.x}
                      spriteY={sprite.y}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleEndGame}>
        End Game
      </Button>
    </div>
  );
}
