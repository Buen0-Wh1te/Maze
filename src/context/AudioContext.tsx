import { createContext } from 'react';

export interface AudioContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);
