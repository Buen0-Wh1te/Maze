import { useState, type ReactNode } from 'react';
import { GameContext } from './GameContext';

export function GameProvider({ children }: { children: ReactNode }) {
  const [pseudo, setPseudo] = useState('');

  return (
    <GameContext.Provider value={{ pseudo, setPseudo }}>
      {children}
    </GameContext.Provider>
  );
}
