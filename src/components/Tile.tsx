import type { TileType } from "../types/game";
import tilesetPath from "../assets/tileset/tileset_path.png";
import tilesetWall from "../assets/tileset/tileset_wall.png";
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

export function Tile({ type, revealed, isPlayer = false, onClick, spriteX = 0, spriteY = 0, debugMode = false }: TileProps) {
  const config = TILE_CONFIG[type] || { label: "", useSprite: false, fallbackColor: "bg-gray-600" };
  const effectiveRevealed = debugMode || revealed;
  const useSprite = config.useSprite && effectiveRevealed;

  const tileset = type === "W" ? tilesetWall : tilesetPath;
  const backgroundPositionX = TILE_BORDER + spriteX * (TILE_SIZE + TILE_GAP);
  const backgroundPositionY = TILE_BORDER + spriteY * (TILE_SIZE + TILE_GAP);

  return (
    <div
      onClick={onClick}
      className={`absolute inset-0 flex items-center justify-center font-bold text-white cursor-pointer hover:brightness-110
        ${effectiveRevealed ? (useSprite ? "" : config.fallbackColor) : "bg-gray-800"}
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
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
            }
          : {
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
              fontSize: "20px",
            }
      }
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
      {!useSprite && effectiveRevealed && (isPlayer ? "P" : config.label)}
    </div>
  );
}
