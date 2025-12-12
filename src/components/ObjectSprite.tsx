import { useEffect, useState } from 'react';
import KeyFrame1 from '../assets/sprites/Key/keys_1_1.png';
import KeyFrame2 from '../assets/sprites/Key/keys_1_2.png';
import KeyFrame3 from '../assets/sprites/Key/keys_1_3.png';
import KeyFrame4 from '../assets/sprites/Key/keys_1_4.png';

interface ObjectSpriteProps {
  type: 'K'; // Key type for now, can extend later
  size: number;
}

const KEY_SPRITES = [KeyFrame1, KeyFrame2, KeyFrame4, KeyFrame3, KeyFrame4, KeyFrame2];
const ANIMATION_LOOP = [0, 1, 2, 3, 4, 5]; // Maps to: 1-2-4-3-4-2
const FRAME_DELAY_MS = 300;

function useObjectAnimation(frameCount: number, frameDelay: number) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameCount);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [frameCount, frameDelay]);

  return currentFrame;
}

export function ObjectSprite({ type, size }: ObjectSpriteProps) {
  const frameIndex = useObjectAnimation(ANIMATION_LOOP.length, FRAME_DELAY_MS);
  const currentSprite = KEY_SPRITES[ANIMATION_LOOP[frameIndex]];

  // Make object sprite much smaller than tile
  const objectSize = size * 0.4;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        imageRendering: 'pixelated',
      }}
    >
      <img
        src={currentSprite}
        alt={`${type} object`}
        style={{
          width: `${objectSize}px`,
          height: `${objectSize}px`,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
