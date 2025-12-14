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
  debugMode?: boolean;
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
  I: { label: "I", useSprite: false, fallbackColor: "bg-purple-400", usePathBackground: true },
};

export function Tile({
  type,
  revealed,
  isPlayer = false,
  onClick,
  spriteX = 0,
  spriteY = 0,
  debugMode = false,
}: TileProps) {
  const config = TILE_CONFIG[type] || { label: "", useSprite: false, fallbackColor: "bg-gray-600", usePathBackground: false };
  const effectiveRevealed = debugMode || revealed;
  const useSprite = config.useSprite && effectiveRevealed;
  const usePathBackground = config.usePathBackground && effectiveRevealed;
  const showObjectSprite = type === "K" && effectiveRevealed;

  const tileset = type === "W" ? tilesetWall : tilesetPath;
  const backgroundPositionX = TILE_BORDER + spriteX * (TILE_SIZE + TILE_GAP);
  const backgroundPositionY = TILE_BORDER + spriteY * (TILE_SIZE + TILE_GAP);

  const getBackgroundStyle = () => {
    if (!effectiveRevealed) {
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
      className={`absolute inset-0 flex items-center justify-center font-bold text-white cursor-pointer hover:brightness-110 ${className} ${isPlayer ? "ring-4 ring-blue-400 ring-inset" : ""}`}
      style={{
        ...style,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        fontSize: "20px",
      }}
    >
      {debugMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-white font-bold text-xs bg-black/70 px-1 rounded pointer-events-none"
            style={{ fontSize: "10px", textShadow: "0 0 2px black" }}
          >
            {type}
          </span>
        </div>
      )}
      {!useSprite && !usePathBackground && effectiveRevealed && !isPlayer && config.label}
      {showObjectSprite && <ObjectSprite type="K" size={TILE_SIZE} />}
      {type === "D" && effectiveRevealed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-amber-800"
            style={{
              width: `${TILE_SIZE * 0.6}px`,
              height: `${TILE_SIZE * 0.6}px`,
            }}
          />
        </div>
      )}
    </div>
  );
}
