import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { useGame } from "../hooks/useGame";
import backgroundImage from "../assets/backgrounds/dungeon-corridor.webp";

export function Home() {
  const navigate = useNavigate();
  const { pseudo, setPseudo } = useGame();

  const handleStartGame = () => {
    if (pseudo.trim()) {
      navigate("/game/1");
    }
  };

  return (
    <div
      className="text-white flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.h1
        className="text-9xl font-bold text-center"
        style={{
          fontFamily: "'UnifrakturCook', cursive",
          background:
            "radial-gradient(circle, #e8e8e8 0%, #d0d0d0 30%, #b0b0b0 60%, #909090 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow:
            "2px 2px 0px rgba(0,0,0,0.3), 4px 4px 0px rgba(0,0,0,0.2), 6px 6px 0px rgba(0,0,0,0.1)",
        }}
        animate={{
          x: [0, 3.5, 7, 7, 7, 3.5, 0, -3.5, -7, -7, -7, -3.5, 0],
          y: [0, -3.5, -5, -6, -7, -7, -7, -7, -7, -6, -5, -3.5, 0],
          rotate: [0, -1, -2, -2, -1.5, -0.5, 0, 0.5, 1.5, 2, 2, 1, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        The (Ultimate)
        <br />
        Maze Game
      </motion.h1>
      <p className="mt-8 text-center max-w-2xl px-4 text-lg text-gray-300">
        The goal of the game is to find the exit by lifting the tiles to reveal
        the path. You can only reveal tiles adjacent to the ones already
        revealed.
      </p>
      <input
        type="text"
        placeholder="Enter your pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500 focus:border-pink-800 focus:outline-none mt-8"
      />
      <Button
        onClick={handleStartGame}
        disabled={!pseudo.trim()}
        className="mt-4"
      >
        Start Game
      </Button>
    </div>
  );
}
