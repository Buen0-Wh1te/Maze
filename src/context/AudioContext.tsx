import { createContext, type RefObject } from 'react';

export interface AudioContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  backgroundMusicRef: RefObject<HTMLAudioElement> | null;
}

export const AudioContext = createContext<AudioContextType | null>(null);
