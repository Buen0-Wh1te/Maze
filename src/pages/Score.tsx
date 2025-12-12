import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { useEndGameAudio } from "../hooks/useEndGameAudio";
import { saveScore } from "../utils/scores";
import backgroundImage from "../assets/backgrounds/endgame.jpg";
import gameoverSound from "../assets/sounds/gameover.mp3";

export function Score() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || {};
  const scoreSavedRef = useRef(false);
  const { resumeBackgroundMusic } = useEndGameAudio({
    soundFile: gameoverSound,
  });

  useEffect(() => {
    if (!score) {
      navigate("/");
      return;
    }
  }, [score, navigate]);

  useEffect(() => {
    if (score && !scoreSavedRef.current) {
      saveScore(score, 1);
      scoreSavedRef.current = true;
    }
  }, [score]);

  const handlePlayAgain = () => {
    resumeBackgroundMusic();
    navigate("/");
  };

  return (
    <div
      className="text-white flex flex-col items-center justify-center min-h-screen overflow-x-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        className="w-[200vw] flex items-center justify-center py-8"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(20px)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1
          className="text-9xl font-bold text-center px-4"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: "#8B0000",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow:
              "2px 2px 0px rgba(139,0,0,0.3), 4px 4px 0px rgba(139,0,0,0.2), 6px 6px 0px rgba(139,0,0,0.1)",
          }}
        >
          You fell to your death
        </h1>
      </motion.div>
      {score && (
        <motion.div
          className="bg-black px-4 py-2 rounded text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="text-gray-400">Score: </span>
          <span className="font-bold text-white">{score.totalScore}</span>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="flex gap-4 mt-8"
      >
        <Button onClick={handlePlayAgain}>Try Again</Button>
        <Button onClick={() => navigate("/highscores")}>View Highscores</Button>
      </motion.div>
    </div>
  );
}
