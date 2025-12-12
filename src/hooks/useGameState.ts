import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";
import type { TileState, TileType } from "../types/game";
import { TILE_TYPES, SCORE_FACTORS } from "../constants/config";
import { useInventory } from "./useInventory";
import { useCombat } from "./useCombat";

export function useGameState(levelId: number | undefined, pseudo: string) {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(null);
  const [tiles, setTiles] = useState<TileState[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerPos, setPlayerPos] = useState<{ row: number; col: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const inventory = useInventory();
  const combat = useCombat();

  useEffect(() => {
    if (levelId) {
      loadLevel(levelId);
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
      setError(null);
      const levelData = await fetchLevel(levelId);
      setLevel(levelData);

      const initialTiles: TileState[][] = levelData.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const rawType = cell.split(":")[0];
          const type = rawType as TileType;

          return {
            position: { row: rowIndex, col: colIndex },
            type,
            content: cell,
            revealed:
              rowIndex === levelData.start.row && colIndex === levelData.start.col,
          };
        })
      );

      setTiles(initialTiles);
      setPlayerPos(levelData.start);
    } catch (err) {
      console.error("Failed to load level:", err);
      setError("Failed to load level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    const tilesRevealed = tiles.flat().filter((tile) => tile.revealed).length;
    const timeElapsed = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;

    const rawScore =
      SCORE_FACTORS.BASE_SCORE -
      tilesRevealed * SCORE_FACTORS.TILE_PENALTY -
      moves * SCORE_FACTORS.MOVE_PENALTY -
      timeElapsed * SCORE_FACTORS.TIME_BONUS_PER_SECOND;

    const totalScore = Math.max(rawScore, SCORE_FACTORS.MIN_SCORE);

    return {
      pseudo,
      tilesRevealed,
      moves,
      timeElapsed,
      totalScore,
    };
  };

  const revealTile = (row: number, col: number) => {
    const updated = [...tiles];
    updated[row][col].revealed = true;
    setTiles(updated);
    return updated;
  };

  const clearTile = (row: number, col: number) => {
    const updated = [...tiles];
    updated[row][col].type = TILE_TYPES.PATH;
    updated[row][col].content = "C";
    setTiles(updated);
  };

  const movePlayer = (row: number, col: number) => {
    setPlayerPos({ row, col });
    setMoves((prev) => prev + 1);
  };

  const checkVictory = async (row: number, col: number) => {
    if (tiles[row][col].type === TILE_TYPES.END) {
      const nextLevelId = levelId ? Number(levelId) + 1 : 2;
      try {
        await fetchLevel(nextLevelId);
        navigate(`/game/${nextLevelId}`);
        return true;
      } catch {
        const score = calculateScore();
        navigate("/victory", { state: { score } });
        return true;
      }
    }
    return false;
  };

  const handleEndGame = () => {
    const score = calculateScore();
    navigate("/score", { state: { score } });
  };

  const retryLevel = () => {
    if (levelId) {
      loadLevel(levelId);
    }
  };

  return {
    level,
    tiles,
    loading,
    error,
    playerPos,
    moves,
    startTime,
    revealTile,
    clearTile,
    movePlayer,
    checkVictory,
    handleEndGame,
    retryLevel,
    inventory,
    combat,
  };
}
