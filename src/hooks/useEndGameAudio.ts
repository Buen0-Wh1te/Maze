import { useEffect } from "react";
import { useAudio } from "./useAudio";

interface UseEndGameAudioOptions {
  soundFile: string;
  soundVolume?: number;
}

export function useEndGameAudio({ soundFile, soundVolume = 0.6 }: UseEndGameAudioOptions) {
  const { backgroundMusicRef, isMuted } = useAudio();

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef?.current) {
      backgroundMusicRef.current.pause();
    }
  };

  const playSound = () => {
    if (isMuted) return;

    const audio = new Audio(soundFile);
    audio.volume = soundVolume;
    audio.play().catch((error) => {
      console.log('Sound play prevented:', error);
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
    playSound();
  }, [backgroundMusicRef, isMuted]);

  return { resumeBackgroundMusic };
}
