import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { getScores, clearScores } from "../utils/scores";
import backgroundImage from "../assets/backgrounds/dungeon-corridor.webp";

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
    <div
      className="text-white min-h-screen p-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-6xl font-bold text-center mb-8"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "2px 2px 0px rgba(255, 215, 0, 0.3)",
          }}
        >
          Hall of Champions
        </h1>

        {scores.length === 0 ? (
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded p-6">
            <p className="text-center text-gray-300">
              No scores yet. Play a game to set a record!
            </p>
          </div>
        ) : (
          <div className="bg-slate-800/90 backdrop-blur-sm border border-pink-900/50 rounded overflow-hidden">
            <div className="grid grid-cols-[60px_minmax(150px,1fr)_100px_80px_80px_80px] gap-4 px-4 py-3 bg-slate-900/50 text-xs font-semibold text-gray-400 border-b border-slate-700">
              <div className="text-center">Rank</div>
              <div>Player</div>
              <div className="text-right">Score</div>
              <div className="text-right">Tiles</div>
              <div className="text-right">Moves</div>
              <div className="text-right">Time</div>
            </div>
            {scores.map((score, index) => (
              <div
                key={index}
                className="grid grid-cols-[60px_minmax(150px,1fr)_100px_80px_80px_80px] gap-4 px-4 py-3 border-b border-slate-700/50 last:border-0"
              >
                <div
                  className="text-center font-bold"
                  style={{
                    color: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : index === 2 ? "#CD7F32" : "#FFFFFF",
                  }}
                >
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-pink-300">{score.pseudo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">{score.totalScore}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-200">{score.tilesRevealed}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-200">{score.moves}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-200">{score.timeElapsed}s</p>
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
