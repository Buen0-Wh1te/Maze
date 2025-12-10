import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { fetchLevel } from "../services/api";
import type { Level } from "../types/api";

export function Game() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigate) return;

    fetchLevel(Number(navigate))
      .then((data) => setLevel(data))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEndGame = () => {
    navigate("/score");
  };

  if (loading) return <p>Loading level…</p>;
  if (!level) return <p>Level not found.</p>;

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Game</h1>
      <h3 className="text-4xl font-bold">Level {level.id}</h3>
      <pre>{JSON.stringify(level, null, 2)}</pre>
      <p className="text-gray-400">Game screen - Grid will be displayed here</p>
      <Button onClick={handleEndGame}>End Game</Button>
    </div>
  );
}
