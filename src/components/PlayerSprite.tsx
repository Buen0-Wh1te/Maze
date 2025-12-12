import { useEffect, useState } from 'react';
import WarriorIdle from '../assets/sprites/Warrior/Warrior_Idle.png';
import WarriorRun from '../assets/sprites/Warrior/Warrior_Run.png';

interface PlayerSpriteProps {
  isMoving?: boolean;
  direction?: 'down' | 'left' | 'right' | 'up';
  size?: number;
}

const SPRITE_CONFIG = {
  frameSize: 48, // Each frame is 48x48px
  idle: {
    src: WarriorIdle,
    frames: 8, // 8 frames per direction
  },
  run: {
    src: WarriorRun,
    frames: 6, // 6 frames per direction
  },
};

const DIRECTION_ROW = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

export function PlayerSprite({
  isMoving = false,
  direction = 'down',
  size = 32
}: PlayerSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  const animation = isMoving ? SPRITE_CONFIG.run : SPRITE_CONFIG.idle;
  const directionRow = DIRECTION_ROW[direction];

  // Animate sprite frames
  useEffect(() => {
    const frameDelay = isMoving ? 100 : 150; // Faster animation when moving

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % animation.frames);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [isMoving, animation.frames]);

  // Calculate sprite sheet position
  const frameX = currentFrame * SPRITE_CONFIG.frameSize;
  const frameY = directionRow * SPRITE_CONFIG.frameSize;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url(${animation.src})`,
          backgroundPosition: `-${frameX}px -${frameY}px`,
          backgroundSize: `${(animation.frames * SPRITE_CONFIG.frameSize * size) / SPRITE_CONFIG.frameSize}px ${(4 * SPRITE_CONFIG.frameSize * size) / SPRITE_CONFIG.frameSize}px`,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
