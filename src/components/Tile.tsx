import type { TileType } from '../types/game';

interface TileProps {
  type: TileType;
  revealed: boolean;
  onClick?: () => void;
}

const getTileStyle = (type: TileType, revealed: boolean): string => {
  if (!revealed) {
    return 'bg-gray-800 border-gray-700';
  }

  switch (type) {
    case 'S':
      return 'bg-green-600 border-green-700';
    case 'E':
      return 'bg-blue-600 border-blue-700';
    case 'C':
      return 'bg-gray-400 border-gray-500';
    case 'W':
      return 'bg-stone-800 border-stone-900';
    case 'M':
      return 'bg-red-600 border-red-700';
    case 'K':
      return 'bg-yellow-500 border-yellow-600';
    case 'D':
      return 'bg-amber-700 border-amber-800';
    case 'A':
      return 'bg-purple-600 border-purple-700';
    case 'O':
      return 'bg-orange-600 border-orange-700';
    default:
      return 'bg-gray-600 border-gray-700';
  }
};

const getTileLabel = (type: TileType, revealed: boolean): string => {
  if (!revealed) return '';

  switch (type) {
    case 'S': return 'S';
    case 'E': return 'E';
    case 'C': return '';
    case 'W': return '';
    case 'M': return 'M';
    case 'K': return 'K';
    case 'D': return 'D';
    case 'A': return 'A';
    case 'O': return 'O';
    default: return '';
  }
};

export function Tile({ type, revealed, onClick }: TileProps) {
  const style = getTileStyle(type, revealed);
  const label = getTileLabel(type, revealed);

  return (
    <div
      onClick={onClick}
      className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-white cursor-pointer transition-colors hover:opacity-80 ${style}`}
    >
      {label}
    </div>
  );
}
