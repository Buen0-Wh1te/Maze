import { useRef, useCallback } from 'react';
import { useAudio } from './useAudio';
import buttonPressSound from '../assets/sounds/buttonpressed.mp3';

export function useInputSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted } = useAudio();

  if (!audioRef.current) {
    audioRef.current = new Audio(buttonPressSound);
    audioRef.current.volume = 0.6;
  }

  const playSound = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = 0.9 + Math.random() * 0.2;
      audioRef.current.play().catch((error) => {
        console.log('Audio play prevented:', error);
      });
    }
  }, [isMuted]);

  const onKeyDown = useCallback(() => {
    playSound();
  }, [playSound]);

  return { onKeyDown };
}
