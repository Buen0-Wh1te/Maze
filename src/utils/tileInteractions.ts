import type { Level, Enemy, Item } from "../types/api";
import type { TileType } from "../types/game";
import { TILE_TYPES } from "../constants/config";

export interface TileInteractionResult {
  canMove: boolean;
  shouldShowBattle?: boolean;
  shouldClearTile?: boolean;
  enemy?: Enemy;
  message?: string;
}

export function handleTileInteraction(
  tileType: TileType,
  tileContent: string,
  level: Level | null,
  hasKey: (color: string) => boolean,
  addKey: (color: string) => void,
  removeKey: (color: string) => void,
  setWeapon: (weapon: Item) => void,
  addItem: (item: Item) => void,
  startBattle: (enemy: Enemy) => void
): TileInteractionResult {
  if (tileType === TILE_TYPES.WALL) {
    return { canMove: false };
  }

  if (tileType === TILE_TYPES.KEY) {
    const color = tileContent.split(":")[1];
    if (color) {
      addKey(color);
    }
    return { canMove: true, shouldClearTile: true, message: `Picked up ${color} key!` };
  }

  if (tileType === TILE_TYPES.DOOR) {
    const color = tileContent.split(":")[1];
    if (!color || !hasKey(color)) {
      return {
        canMove: false,
        message: color ? `Need ${color} key to open this door` : "Door is locked",
      };
    }
    removeKey(color);
    return { canMove: true, shouldClearTile: true, message: `Opened ${color} door` };
  }

  if (tileType === TILE_TYPES.ARMOR) {
    const itemId = tileContent.split(":")[1];
    if (level && itemId) {
      const item = level.items.find((i) => i.id === itemId);
      if (item) {
        setWeapon(item);
        return { canMove: true, shouldClearTile: true, message: `Picked up ${item.name}!` };
      }
    }
    return { canMove: true };
  }

  if (tileType === TILE_TYPES.ITEM) {
    const itemId = tileContent.split(":")[1];
    if (level && itemId) {
      const item = level.items.find((i) => i.id === itemId);
      if (item) {
        addItem(item);
        return { canMove: true, shouldClearTile: true, message: `Picked up ${item.name}!` };
      }
    }
    return { canMove: true };
  }

  if (tileType === TILE_TYPES.MONSTER) {
    const enemyType = tileContent.split(":")[1];
    if (level && enemyType) {
      const enemy = level.enemies.find((e) => e.type === enemyType);
      if (enemy) {
        startBattle(enemy);
        return { canMove: false, shouldShowBattle: true, enemy };
      }
    }
    return { canMove: false };
  }

  return { canMove: true };
}
