import { useState, useRef, type ReactNode } from 'react';
import { AudioContext } from './AudioContext';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted, backgroundMusicRef }}>
      {children}
    </AudioContext.Provider>
  );
}
