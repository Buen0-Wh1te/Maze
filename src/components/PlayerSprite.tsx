import { useEffect, useState } from 'react';
import WarriorIdle from '../assets/sprites/Warrior/Warrior_Idle.png';
import WarriorRun from '../assets/sprites/Warrior/Warrior_Run.png';

interface PlayerSpriteProps {
  isMoving?: boolean;
  direction?: 'left' | 'right';
  size?: number;
  transitionOffset?: { x: number; y: number };
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
  size = 32,
  transitionOffset = { x: 0, y: 0 }
}: PlayerSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  const animation = isMoving ? SPRITE_CONFIG.run : SPRITE_CONFIG.idle;
  const isFlipped = direction === 'left';

  // Animate sprite frames
  useEffect(() => {
    const frameDelay = isMoving ? 50 : 120; // Very fast animation when moving

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % animation.frames);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [isMoving, animation.frames]);

  // Calculate sprite sheet position (only use first row)
  const frameX = currentFrame * SPRITE_CONFIG.frameSize;

  // Make sprite slightly larger than tile
  const spriteSize = size * 1.2;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        imageRendering: 'pixelated',
        transform: `translate(${transitionOffset.x}px, ${transitionOffset.y}px)`,
        transition: isMoving ? 'transform 600ms linear' : 'none',
      }}
    >
      <div
        style={{
          width: `${spriteSize}px`,
          height: `${spriteSize}px`,
          backgroundImage: `url(${animation.src})`,
          backgroundPosition: `-${frameX * (spriteSize / SPRITE_CONFIG.frameSize)}px 0px`,
          backgroundSize: `${animation.frames * spriteSize}px ${spriteSize}px`,
          imageRendering: 'pixelated',
          transform: isFlipped ? 'scaleX(-1)' : 'none',
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
