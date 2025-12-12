import { useEffect, useState } from 'react';
import WarriorIdle from '../assets/sprites/Warrior/Warrior_Idle.png';
import WarriorRun from '../assets/sprites/Warrior/Warrior_Run.png';

interface PlayerSpriteProps {
  isMoving?: boolean;
  direction?: 'left' | 'right';
  size?: number;
}

const SPRITE_CONFIG = {
  frameSize: 192, // Each frame is 192x192px
  idle: {
    src: WarriorIdle,
    frames: 8,
  },
  run: {
    src: WarriorRun,
    frames: 6,
  },
};

export function PlayerSprite({
  isMoving = false,
  direction = 'right',
  size = 32
}: PlayerSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  const animation = isMoving ? SPRITE_CONFIG.run : SPRITE_CONFIG.idle;
  const isFlipped = direction === 'left';

  // Animate sprite frames
  useEffect(() => {
    const frameDelay = isMoving ? 100 : 150; // Faster animation when moving

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % animation.frames);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [isMoving, animation.frames]);

  // Calculate sprite sheet position (only use first row)
  const frameX = currentFrame * SPRITE_CONFIG.frameSize;

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
          backgroundPosition: `-${frameX * (size / SPRITE_CONFIG.frameSize)}px 0px`,
          backgroundSize: `${animation.frames * size}px ${size}px`,
          imageRendering: 'pixelated',
          transform: isFlipped ? 'scaleX(-1)' : 'none',
        }}
      />
    </div>
  );
}
