import { useState, useCallback } from "react";

interface Enemy {
  type: string;
  name: string;
  hp: number;
  attack: number;
  description: string;
}

export function useCombat() {
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [isBattleActive, setIsBattleActive] = useState(false);

  const startBattle = useCallback((enemy: Enemy) => {
    setCurrentEnemy(enemy);
    setIsBattleActive(true);
  }, []);

  const endBattle = useCallback(() => {
    setCurrentEnemy(null);
    setIsBattleActive(false);
  }, []);

  const fight = useCallback((hasWeapon: boolean): "victory" | "defeat" => {
    if (hasWeapon) {
      return "victory";
    }
    return "defeat";
  }, []);

  return {
    currentEnemy,
    isBattleActive,
    startBattle,
    endBattle,
    fight,
  };
}
