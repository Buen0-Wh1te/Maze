import type { TileType } from "../types/game";
import tilesetPath from "../assets/tileset/tileset_path.png";
import tilesetWall from "../assets/tileset/tileset_wall.png";

interface TileProps {
  type: TileType;
  revealed: boolean;
  isPlayer?: boolean;
  onClick?: () => void;
  spriteX?: number;
  spriteY?: number;
}

// Tileset uses 32x32 tiles with 1px gaps between tiles and 1px overall border
const TILE_SIZE = 32;
const TILE_GAP = 1;
const BORDER_SIZE = 1;

const TILE_CONFIG: Record<TileType, { label: string; useSprite: boolean; fallbackColor: string }> = {
  S: { label: "S", useSprite: false, fallbackColor: "bg-green-600" },
  E: { label: "E", useSprite: false, fallbackColor: "bg-blue-600" },
  C: { label: "", useSprite: true, fallbackColor: "bg-gray-400" }, // Path tiles use sprite
  W: { label: "", useSprite: true, fallbackColor: "bg-stone-800" }, // Wall tiles use sprite
  M: { label: "M", useSprite: false, fallbackColor: "bg-red-600" },
  K: { label: "K", useSprite: false, fallbackColor: "bg-yellow-500" },
  D: { label: "D", useSprite: false, fallbackColor: "bg-amber-700" },
  A: { label: "A", useSprite: false, fallbackColor: "bg-purple-600" },
  O: { label: "O", useSprite: false, fallbackColor: "bg-orange-600" },
};

export function Tile({ type, revealed, isPlayer = false, onClick, spriteX = 0, spriteY = 0 }: TileProps) {
  const config = TILE_CONFIG[type] || { label: "", useSprite: false, fallbackColor: "bg-gray-600" };
  const useSprite = config.useSprite && revealed;

  // Determine which tileset to use
  const tileset = type === "W" ? tilesetWall : tilesetPath;

  // Calculate background position for sprite
  // Formula: border + (tileSize + gap) * index
  const backgroundPositionX = BORDER_SIZE + spriteX * (TILE_SIZE + TILE_GAP);
  const backgroundPositionY = BORDER_SIZE + spriteY * (TILE_SIZE + TILE_GAP);

  return (
    <div
      onClick={onClick}
      className={`absolute inset-0 flex items-center justify-center font-bold text-white cursor-pointer transition-all hover:brightness-110
        ${revealed ? (useSprite ? "" : config.fallbackColor) : "bg-gray-800"}
        ${revealed ? "opacity-100" : "opacity-100"}
        ${isPlayer ? "ring-4 ring-blue-400 ring-inset" : ""}
      `}
      style={
        useSprite
          ? {
              backgroundImage: `url(${tileset})`,
              backgroundPosition: `-${backgroundPositionX}px -${backgroundPositionY}px`,
              backgroundSize: "auto",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
              width: "32px",
              height: "32px",
            }
          : {
              width: "32px",
              height: "32px",
              fontSize: "20px",
            }
      }
    >
      {!useSprite && revealed && (isPlayer ? "P" : config.label)}
    </div>
  );
}
