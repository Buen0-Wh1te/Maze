import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "../components/Button";
import { useAudio } from "../hooks/useAudio";
import backgroundImage from "../assets/backgrounds/endgame.jpg";
import gameoverSound from "../assets/sounds/gameover.mp3";

export function Score() {
  const navigate = useNavigate();
  const { backgroundMusicRef, isMuted } = useAudio();

  useEffect(() => {
    // Stop background music
    if (backgroundMusicRef?.current) {
      backgroundMusicRef.current.pause();
    }

    // Play gameover sound
    if (!isMuted) {
      const audio = new Audio(gameoverSound);
      audio.volume = 0.6;
      audio.play().catch((error) => {
        console.log('Gameover sound play prevented:', error);
      });
    }
  }, [backgroundMusicRef, isMuted]);

  const handlePlayAgain = () => {
    // Resume background music when going back
    if (backgroundMusicRef?.current) {
      backgroundMusicRef.current.play().catch((error) => {
        console.log('Background music resume prevented:', error);
      });
    }
    navigate("/");
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
      <motion.div
        className="w-[200vw] flex items-center justify-center py-8"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(20px)",
          maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Button onClick={handlePlayAgain} className="mt-8">
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}
