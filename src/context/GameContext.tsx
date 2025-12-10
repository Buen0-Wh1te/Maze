import { createContext, useContext, useState, type ReactNode } from 'react';

interface GameContextType {
  pseudo: string;
  setPseudo: (pseudo: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [pseudo, setPseudo] = useState('');

  return (
    <GameContext.Provider value={{ pseudo, setPseudo }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
