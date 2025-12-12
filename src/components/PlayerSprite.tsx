import { useEffect, useState } from 'react';
import WarriorIdle from '../assets/sprites/Warrior/Warrior_Idle.png';
import WarriorRun from '../assets/sprites/Warrior/Warrior_Run.png';
import { PLAYER_SPRITE_CONFIG } from '../constants/config';

interface PlayerSpriteProps {
  isMoving?: boolean;
  direction?: 'left' | 'right';
  size: number;
  transitionOffset: { x: number; y: number };
}

const SPRITE_SHEET_CONFIG = {
  FRAME_SIZE: 192,
  IDLE_FRAMES: 8,
  RUN_FRAMES: 6,
} as const;

function useSpriteAnimation(isMoving: boolean, totalFrames: number) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const frameDelay = isMoving
      ? PLAYER_SPRITE_CONFIG.FRAME_DELAY_RUNNING_MS
      : PLAYER_SPRITE_CONFIG.FRAME_DELAY_IDLE_MS;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [isMoving, totalFrames]);

  return currentFrame;
}

function calculateSpritePosition(currentFrame: number, spriteSize: number) {
  const frameX = currentFrame * SPRITE_SHEET_CONFIG.FRAME_SIZE;
  const scale = spriteSize / SPRITE_SHEET_CONFIG.FRAME_SIZE;

  return {
    x: frameX * scale,
    width: spriteSize,
  };
}

export function PlayerSprite({
  isMoving = false,
  direction = 'right',
  size,
  transitionOffset,
}: PlayerSpriteProps) {
  const spriteSheet = isMoving ? WarriorRun : WarriorIdle;
  const totalFrames = isMoving ? SPRITE_SHEET_CONFIG.RUN_FRAMES : SPRITE_SHEET_CONFIG.IDLE_FRAMES;

  const currentFrame = useSpriteAnimation(isMoving, totalFrames);
  const spriteSize = size * PLAYER_SPRITE_CONFIG.SIZE_MULTIPLIER;
  const { x: frameX, width } = calculateSpritePosition(currentFrame, spriteSize);
  const isFlipped = direction === 'left';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        imageRendering: 'pixelated',
        transform: `translate(${transitionOffset.x}px, ${transitionOffset.y}px)`,
        transition: isMoving ? `transform ${PLAYER_SPRITE_CONFIG.MOVEMENT_DURATION_MS}ms linear` : 'none',
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${width}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `-${frameX}px 0px`,
          backgroundSize: `${totalFrames * width}px ${width}px`,
          imageRendering: 'pixelated',
          transform: isFlipped ? 'scaleX(-1)' : 'none',
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
