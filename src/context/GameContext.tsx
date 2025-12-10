import { createContext } from 'react';

export interface GameContextType {
  pseudo: string;
  setPseudo: (pseudo: string) => void;
}

export const GameContext = createContext<GameContextType | null>(null);