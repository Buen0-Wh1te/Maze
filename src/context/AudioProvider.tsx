import { useState, type ReactNode } from 'react';
import { AudioContext } from './AudioContext';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </AudioContext.Provider>
  );
}
