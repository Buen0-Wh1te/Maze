import { Button } from "./Button";
import { GRADIENT_GOLD } from "../constants/config";

interface Enemy {
  type: string;
  name: string;
  hp: number;
  attack: number;
  description: string;
}

interface BattleModalProps {
  enemy: Enemy;
  hasWeapon: boolean;
  onFight: () => void;
  onFlee: () => void;
}

export function BattleModal({ enemy, hasWeapon, onFight, onFlee }: BattleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{
            fontFamily: "'UnifrakturCook', cursive",
            background: GRADIENT_GOLD,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Enemy Encountered!
        </h2>

        <div className="bg-black/50 rounded p-4 mb-4">
          <h3 className="text-xl text-white font-bold mb-2">{enemy.name}</h3>
          <p className="text-white text-sm mb-3">{enemy.description}</p>

          <div className="flex gap-4 text-sm">
            <div className="flex-1">
              <span className="text-white">HP:</span>
              <span className="text-white font-bold ml-2">{enemy.hp}</span>
            </div>
            <div className="flex-1">
              <span className="text-white">Attack:</span>
              <span className="text-white font-bold ml-2">{enemy.attack}</span>
            </div>
          </div>
        </div>

        {!hasWeapon && (
          <div className="bg-yellow-900/30 rounded p-3 mb-4">
            <p className="text-white text-sm text-center">
              You don't have a weapon! You cannot fight this enemy.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onFight}
            disabled={!hasWeapon}
            className={hasWeapon ? "flex-1" : "flex-1 opacity-50 cursor-not-allowed"}
          >
            {hasWeapon ? "Fight" : "No Weapon"}
          </Button>
          <Button
            onClick={onFlee}
            className="flex-1 bg-gray-700 hover:bg-gray-600"
          >
            Flee
          </Button>
        </div>
      </div>
    </div>
  );
}
