import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";
import { useGame } from "../hooks/useGame";

export function Game() {
  const navigate = useNavigate();
  const { pseudo } = useGame();
  const { id } = useParams<{ id: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchLevel(Number(id))
      .then((data) => setLevel(data))
      .catch((err) => {
        console.error(err);
        setLevel(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEndGame = () => {
    navigate("/score");
  };

  if (loading) return <p>Loading level…</p>;
  if (!level) return <p>Level not found.</p>;

  const cellColor = (cell: string) => {
    switch (cell) {
      case "wall":
        return "bg-gray-800";
      case "start":
        return "bg-green-500";
      case "end":
        return "bg-red-500";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Game</h1>
      <p>Hello, {pseudo} !</p>
      <h3 className="text-4xl font-bold">Level {level.id}</h3>
      <h3 className="text-4xl font-bold">Difficulty {level.difficulty}</h3>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${level.cols}, 40px)`,
          gridTemplateRows: `repeat(${level.rows}, 40px)`,
        }}
      >
        {level.grid.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-10 h-10 border border-gray-700 ${cellColor(cell)}`}
            />
          ))
        )}
      </div>
      <Button onClick={handleEndGame}>End Game</Button>
    </div>
  );
}
