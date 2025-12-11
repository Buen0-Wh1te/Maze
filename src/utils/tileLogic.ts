import type { TileState } from "../types/game";
import { PATH_TILE_TYPES, TILE_TYPES } from "../constants/config";
import type { Neighbors } from "./tileset";

export function isAdjacentToRevealed(
  row: number,
  col: number,
  tiles: TileState[][]
): boolean {
  const neighbors = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];

  return neighbors.some(
    (neighbor) =>
      neighbor.row >= 0 &&
      neighbor.row < tiles.length &&
      neighbor.col >= 0 &&
      neighbor.col < tiles[0].length &&
      tiles[neighbor.row][neighbor.col].revealed
  );
}

export function isAdjacentToPlayer(
  row: number,
  col: number,
  playerPos: { row: number; col: number }
): boolean {
  return (
    (Math.abs(playerPos.row - row) === 1 && playerPos.col === col) ||
    (Math.abs(playerPos.col - col) === 1 && playerPos.row === row)
  );
}

export function getTileNeighbors(
  row: number,
  col: number,
  tiles: TileState[][]
): Neighbors {
  const isSameType = (r: number, c: number) => {
    if (r < 0 || r >= tiles.length || c < 0 || c >= tiles[0].length) {
      return false;
    }

    const neighborTileData = tiles[r][c];

    if (!neighborTileData.revealed) {
      return false;
    }

    const currentTile = tiles[row][col].type;
    const neighborTile = neighborTileData.type;

    const isCurrentPath = PATH_TILE_TYPES.includes(currentTile as any);
    const isNeighborPath = PATH_TILE_TYPES.includes(neighborTile as any);

    if (isCurrentPath && isNeighborPath) return true;
    if (currentTile === TILE_TYPES.WALL && neighborTile === TILE_TYPES.WALL) return true;

    return false;
  };

  return {
    top: isSameType(row - 1, col),
    right: isSameType(row, col + 1),
    bottom: isSameType(row + 1, col),
    left: isSameType(row, col - 1),
    topLeft: isSameType(row - 1, col - 1),
    topRight: isSameType(row - 1, col + 1),
    bottomLeft: isSameType(row + 1, col - 1),
    bottomRight: isSameType(row + 1, col + 1),
  };
}
