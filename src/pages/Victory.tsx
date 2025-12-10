import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "../components/Button";
import { useAudio } from "../hooks/useAudio";
import backgroundImage from "../assets/backgrounds/victoryscreen.jpg";
import successSound from "../assets/sounds/success.mp3";

export function Victory() {
  const navigate = useNavigate();
  const { backgroundMusicRef, isMuted } = useAudio();

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef?.current) {
      backgroundMusicRef.current.pause();
    }
  };

  const playSuccessSound = () => {
    if (isMuted) return;

    const audio = new Audio(successSound);
    audio.volume = 0.6;
    audio.play().catch((error) => {
      console.log('Success sound play prevented:', error);
    });
  };

  const resumeBackgroundMusic = () => {
    if (backgroundMusicRef?.current) {
      backgroundMusicRef.current.play().catch((error) => {
        console.log('Background music resume prevented:', error);
      });
    }
  };

  useEffect(() => {
    stopBackgroundMusic();
    playSuccessSound();
  }, [backgroundMusicRef, isMuted]);

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
          maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-9xl font-bold text-center px-4"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4))",
          }}
          animate={{
            filter: [
              "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))",
              "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4))",
              "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Victory!
        </motion.h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Button onClick={handlePlayAgain} className="mt-8">
          Play Again
        </Button>
      </motion.div>
    </div>
  );
}
