import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Tile } from "../components/Tile";
import { useGame } from "../hooks/useGame";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";
import type { TileState, TileType } from "../types/game";

export function Game() {
  const navigate = useNavigate();
  const { pseudo } = useGame();
  const [level, setLevel] = useState<Level | null>(null);
  const [tiles, setTiles] = useState<TileState[][]>([]);
  const [loading, setLoading] = useState(true);
  const [playerPos, setPlayerPos] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    loadLevel(1);
  }, []);

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

  const handleTileClick = (row: number, col: number) => {
    if (!playerPos) return;

    const isAdjacent =
      (Math.abs(playerPos.row - row) === 1 && playerPos.col === col) ||
      (Math.abs(playerPos.col - col) === 1 && playerPos.row === row);

    if (!isAdjacent) return;

    if (tiles[row][col].type === "W") return;

    setPlayerPos({ row, col });

    const updated = [...tiles];
    updated[row][col].revealed = true;
    setTiles(updated);

    console.log("Player moved to:", row, col);
  };

  const handleEndGame = () => {
    navigate("/score");
  };

  if (loading) {
    return (
      <div className="bg-slate-700 text-white flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading level...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center min-h-screen p-8 gap-4">
      <h1 className="text-4xl font-bold">{level?.name}</h1>
      <p className="text-gray-400">Playing as: {pseudo}</p>
      <div className="flex flex-col gap-0">
        {tiles.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0">
            {row.map((tile, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                type={tile.type}
                revealed={tile.revealed}
                isPlayer={
                  playerPos?.row === rowIndex && playerPos?.col === colIndex
                }
                onClick={() => handleTileClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <Button onClick={handleEndGame} className="mt-4">
        End Game
      </Button>
    </div>
  );
}
