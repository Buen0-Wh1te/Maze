import type { TileType } from "../types/game";
import tilesetPath from "../assets/tileset/tileset_path.png";
import tilesetWall from "../assets/tileset/tileset_wall.png";
import { ObjectSprite } from "./ObjectSprite";
import { TILE_SIZE, TILE_GAP, TILE_BORDER } from "../constants/config";

interface TileProps {
  type: TileType;
  revealed: boolean;
  isPlayer?: boolean;
  onClick?: () => void;
  spriteX?: number;
  spriteY?: number;
}

const TILE_CONFIG: Record<TileType, { label: string; useSprite: boolean; fallbackColor: string; usePathBackground: boolean }> = {
  S: { label: "S", useSprite: false, fallbackColor: "bg-green-600", usePathBackground: false },
  E: { label: "E", useSprite: false, fallbackColor: "bg-blue-600", usePathBackground: false },
  C: { label: "", useSprite: true, fallbackColor: "bg-gray-400", usePathBackground: false },
  W: { label: "", useSprite: true, fallbackColor: "bg-stone-800", usePathBackground: false },
  M: { label: "M", useSprite: false, fallbackColor: "bg-red-600", usePathBackground: true },
  K: { label: "", useSprite: false, fallbackColor: "", usePathBackground: true }, // Key uses ObjectSprite
  D: { label: "D", useSprite: false, fallbackColor: "bg-amber-700", usePathBackground: true },
  A: { label: "A", useSprite: false, fallbackColor: "bg-purple-600", usePathBackground: true },
  O: { label: "O", useSprite: false, fallbackColor: "bg-orange-600", usePathBackground: true },
};

export function Tile({ type, revealed, isPlayer = false, onClick, spriteX = 0, spriteY = 0 }: TileProps) {
  const config = TILE_CONFIG[type] || { label: "", useSprite: false, fallbackColor: "bg-gray-600", usePathBackground: false };
  const useSprite = config.useSprite && revealed;
  const usePathBackground = config.usePathBackground && revealed;
  const showObjectSprite = type === "K" && revealed;

  const tileset = type === "W" ? tilesetWall : tilesetPath;
  const backgroundPositionX = TILE_BORDER + spriteX * (TILE_SIZE + TILE_GAP);
  const backgroundPositionY = TILE_BORDER + spriteY * (TILE_SIZE + TILE_GAP);

  // Determine background styling
  const getBackgroundStyle = () => {
    if (!revealed) {
      return { className: "bg-gray-800", style: {} };
    }

    if (useSprite) {
      return {
        className: "",
        style: {
          backgroundImage: `url(${tileset})`,
          backgroundPosition: `-${backgroundPositionX}px -${backgroundPositionY}px`,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated" as const,
        }
      };
    }

    if (usePathBackground) {
      return {
        className: "",
        style: {
          backgroundImage: `url(${tilesetPath})`,
          backgroundPosition: `-${backgroundPositionX}px -${backgroundPositionY}px`,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated" as const,
        }
      };
    }

    return { className: config.fallbackColor, style: {} };
  };

  const { className, style } = getBackgroundStyle();

  return (
    <div
      onClick={onClick}
      className={`absolute inset-0 flex items-center justify-center font-bold text-white cursor-pointer hover:brightness-110 ${className}`}
      style={{
        ...style,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        fontSize: "20px",
      }}
    >
      {!useSprite && !usePathBackground && revealed && !isPlayer && config.label}
      {showObjectSprite && <ObjectSprite type="K" size={TILE_SIZE} />}
    </div>
  );
}
