import { useRef, useCallback } from 'react';
import buttonPressSound from '../assets/sounds/buttonpressed.mp3';

export function useInputSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(buttonPressSound);
    audioRef.current.volume = 0.3;
  }

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log('Audio play prevented:', error);
      });
    }
  }, []);

  const onKeyDown = useCallback(() => {
    playSound();
  }, [playSound]);

  return { onKeyDown };
}
