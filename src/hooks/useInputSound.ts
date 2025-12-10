import { useCallback } from 'react';
import { useAudio } from './useAudio';
import buttonPressSound from '../assets/sounds/buttonpressed.mp3';

export function useInputSound() {
  const { isMuted } = useAudio();

  const playSound = useCallback(() => {
    if (!isMuted) {
      const audio = new Audio(buttonPressSound);
      audio.volume = 0.6;
      audio.playbackRate = 0.8 + Math.random() * 0.4;
      audio.play().catch((error) => {
        console.log('Audio play prevented:', error);
      });
    }
  }, [isMuted]);

  const onKeyDown = useCallback(() => {
    playSound();
  }, [playSound]);

  return { onKeyDown };
}
