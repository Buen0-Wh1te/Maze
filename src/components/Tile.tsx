import type { TileType } from "../types/game";

interface TileProps {
  type: TileType;
  revealed: boolean;
  isPlayer?: boolean;
  onClick?: () => void;
}

const TILE_CONFIG: Record<TileType, { style: string; label: string }> = {
  S: { style: "bg-green-600 border-green-700", label: "S" },
  E: { style: "bg-blue-600 border-blue-700", label: "E" },
  C: { style: "bg-gray-400 border-gray-500", label: "" },
  W: { style: "bg-stone-800 border-stone-900", label: "" },
  M: { style: "bg-red-600 border-red-700", label: "M" },
  K: { style: "bg-yellow-500 border-yellow-600", label: "K" },
  D: { style: "bg-amber-700 border-amber-800", label: "D" },
  A: { style: "bg-purple-600 border-purple-700", label: "A" },
  O: { style: "bg-orange-600 border-orange-700", label: "O" },
};

const getTileConfig = (type: TileType, revealed: boolean) => {
  if (!revealed) {
    return { style: "bg-gray-800 border-gray-700", label: "" };
  }
  return (
    TILE_CONFIG[type] || { style: "bg-gray-600 border-gray-700", label: "" }
  );
};

export function Tile({ type, revealed, isPlayer = false, onClick }: TileProps) {
  const { style, label } = getTileConfig(type, revealed);

  return (
    <div
      onClick={onClick}
      className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-white cursor-pointer transition-colors hover:opacity-80 
        ${style}
        ${revealed ? "opacity-100" : "opacity-20"}
        ${isPlayer ? "bg-blue-500" : ""}
        `}
    >
      {isPlayer ? "P" : label}
    </div>
  );
}
