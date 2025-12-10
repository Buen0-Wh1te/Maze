import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { getScores, clearScores } from "../utils/scores";

export function Highscores() {
  const navigate = useNavigate();
  const scores = getScores();

  const handleClearScores = () => {
    if (confirm("Are you sure you want to clear all highscores?")) {
      clearScores();
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-700 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">Highscores</h1>

        {scores.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No scores yet. Play a game to set a record!</p>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <div
                key={index}
                className="bg-slate-800 border-2 border-slate-600 rounded-lg p-6 flex items-center justify-between hover:border-slate-500 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-bold text-yellow-400 w-12 text-center">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{score.pseudo}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(score.date).toLocaleDateString()} at{" "}
                      {new Date(score.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-3xl font-bold text-green-400">{score.totalScore}</p>
                    <p className="text-xs text-gray-400">Score</p>
                  </div>
                  <div>
                    <p className="text-lg">{score.tilesRevealed}</p>
                    <p className="text-xs text-gray-400">Tiles</p>
                  </div>
                  <div>
                    <p className="text-lg">{score.moves}</p>
                    <p className="text-xs text-gray-400">Moves</p>
                  </div>
                  <div>
                    <p className="text-lg">{score.timeElapsed}s</p>
                    <p className="text-xs text-gray-400">Time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={() => navigate("/")}>
            Back to Home
          </Button>
          {scores.length > 0 && (
            <Button
              onClick={handleClearScores}
              className="bg-red-800 hover:bg-red-900 border-red-950"
            >
              Clear All Scores
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
