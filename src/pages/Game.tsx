import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Tile } from "../components/Tile";
import { useGame } from "../hooks/useGame";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";
import type { TileState, TileType } from "../types/game";

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
      tilesRevealed,
      moves,
      timeElapsed,
      totalScore: tilesRevealed * 10 - moves * 2 - timeElapsed,
    };
  };

  const handleTileClick = (row: number, col: number) => {
    if (!playerPos) return;

    const isAdjacent =
      (Math.abs(playerPos.row - row) === 1 && playerPos.col === col) ||
      (Math.abs(playerPos.col - col) === 1 && playerPos.row === row);

    if (!isAdjacent) return;

    if (tiles[row][col].type === "W") return;

    setPlayerPos({ row, col });
    setMoves(prev => prev + 1);

    const updated = [...tiles];
    updated[row][col].revealed = true;
    setTiles(updated);

    if (updated[row][col].type === "E") {
      const score = calculateScore();
      navigate("/victory", { state: { score, pseudo } });
    }
  };

  const handleEndGame = () => {
    const score = calculateScore();
    navigate("/score", { state: { score, pseudo } });
  };

  if (loading) {
    return (
      <div className="bg-slate-700 text-white flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading level...</p>
      </div>
    );
  }

  const tilesRevealed = tiles.flat().filter(tile => tile.revealed).length;

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center min-h-screen p-8 gap-4">
      <h1 className="text-4xl font-bold">{level?.name}</h1>
      <p className="text-gray-400">Playing as: {pseudo}</p>
      <div className="flex gap-6 text-sm text-gray-300">
        <span>Moves: {moves}</span>
        <span>Tiles Revealed: {tilesRevealed}</span>
      </div>
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
