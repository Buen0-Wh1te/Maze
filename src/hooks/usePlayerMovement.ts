import { useState } from "react";
import { TILE_SIZE, PLAYER_SPRITE_CONFIG } from "../constants/config";

type Direction = 'left' | 'right';

interface Position {
  row: number;
  col: number;
}

interface Offset {
  x: number;
  y: number;
}

export function usePlayerMovement() {
  const [direction, setDirection] = useState<Direction>('right');
  const [isMoving, setIsMoving] = useState(false);
  const [transitionOffset, setTransitionOffset] = useState<Offset>({ x: 0, y: 0 });

  const calculateOffset = (fromPos: Position, toPos: Position): Offset => {
    return {
      x: (fromPos.col - toPos.col) * TILE_SIZE,
      y: (fromPos.row - toPos.row) * TILE_SIZE,
    };
  };

  const updateDirection = (fromCol: number, toCol: number): void => {
    if (toCol < fromCol) {
      setDirection('left');
    } else if (toCol > fromCol) {
      setDirection('right');
    }
  };

  const startMovement = (fromPos: Position, toPos: Position): void => {
    // Update direction only for horizontal movement
    if (fromPos.col !== toPos.col) {
      updateDirection(fromPos.col, toPos.col);
    }

    // Calculate offset from old position to new position
    const offset = calculateOffset(fromPos, toPos);

    // Set initial offset (sprite starts at old position)
    setTransitionOffset(offset);
    setIsMoving(true);

    // Animate to new position on next frame
    requestAnimationFrame(() => {
      setTransitionOffset({ x: 0, y: 0 });
    });

    // Reset movement state after animation
    setTimeout(() => {
      setIsMoving(false);
    }, PLAYER_SPRITE_CONFIG.MOVEMENT_DURATION_MS);
  };

  return {
    direction,
    isMoving,
    transitionOffset,
    startMovement,
  };
}
