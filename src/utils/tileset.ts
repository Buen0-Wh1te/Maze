import {
  TILE_SIZE,
  TILE_GAP,
  TILE_BORDER,
  TILESET_CONFIG,
  BITMASK_WEIGHTS,
} from "../constants/config";

export type TileType = "path" | "wall";

export interface Neighbors {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

let bitmapMaskCache: ImageData | null = null;

async function loadBitmapMask(): Promise<ImageData> {
  if (bitmapMaskCache) {
    return bitmapMaskCache;
  }

  const bitmapPath = "/src/assets/bitmap/bitmap.png";

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      bitmapMaskCache = imageData;
      resolve(imageData);
    };
    img.onerror = reject;
    img.src = bitmapPath;
  });
}

function isPixelColored(imageData: ImageData, x: number, y: number): boolean {
  const index = (y * imageData.width + x) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];

  return r < 200 || g < 200 || b < 200;
}

function readBitmaskFromBitmap(imageData: ImageData, tileX: number, tileY: number): number {
  const startX = TILE_BORDER + tileX * (TILE_SIZE + TILE_GAP);
  const startY = TILE_BORDER + tileY * (TILE_SIZE + TILE_GAP);
  const centerX = startX + TILE_SIZE / 2;
  const centerY = startY + TILE_SIZE / 2;

  const topLeftPixel = isPixelColored(imageData, startX + 4, startY + 4);
  const topCenterPixel = isPixelColored(imageData, centerX, startY + 4);
  const topRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, startY + 4);
  const centerRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, centerY);
  const bottomRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, startY + TILE_SIZE - 4);
  const bottomCenterPixel = isPixelColored(imageData, centerX, startY + TILE_SIZE - 4);
  const bottomLeftPixel = isPixelColored(imageData, startX + 4, startY + TILE_SIZE - 4);
  const centerLeftPixel = isPixelColored(imageData, startX + 4, centerY);

  let bitmask = 0;
  if (topLeftPixel) bitmask |= 1 << 0;
  if (topCenterPixel) bitmask |= 1 << 1;
  if (topRightPixel) bitmask |= 1 << 2;
  if (centerRightPixel) bitmask |= 1 << 3;
  if (bottomRightPixel) bitmask |= 1 << 4;
  if (bottomCenterPixel) bitmask |= 1 << 5;
  if (bottomLeftPixel) bitmask |= 1 << 6;
  if (centerLeftPixel) bitmask |= 1 << 7;

  return bitmask;
}

export function calculateTileBitmask(neighbors: Neighbors): number {
  let bitmask = 0;

  if (neighbors.topLeft) bitmask |= 1 << 0;
  if (neighbors.top) bitmask |= 1 << 1;
  if (neighbors.topRight) bitmask |= 1 << 2;
  if (neighbors.right) bitmask |= 1 << 3;
  if (neighbors.bottomRight) bitmask |= 1 << 4;
  if (neighbors.bottom) bitmask |= 1 << 5;
  if (neighbors.bottomLeft) bitmask |= 1 << 6;
  if (neighbors.left) bitmask |= 1 << 7;

  return bitmask;
}

function weightedHammingDistance(a: number, b: number): number {
  const xor = a ^ b;
  let distance = 0;

  if (xor & (1 << 1)) distance += BITMASK_WEIGHTS.CARDINAL;
  if (xor & (1 << 3)) distance += BITMASK_WEIGHTS.CARDINAL;
  if (xor & (1 << 5)) distance += BITMASK_WEIGHTS.CARDINAL;
  if (xor & (1 << 7)) distance += BITMASK_WEIGHTS.CARDINAL;

  if (xor & (1 << 0)) distance += BITMASK_WEIGHTS.DIAGONAL;
  if (xor & (1 << 2)) distance += BITMASK_WEIGHTS.DIAGONAL;
  if (xor & (1 << 4)) distance += BITMASK_WEIGHTS.DIAGONAL;
  if (xor & (1 << 6)) distance += BITMASK_WEIGHTS.DIAGONAL;

  return distance;
}

async function findMatchingTile(targetBitmask: number, _type: TileType): Promise<[number, number]> {
  const imageData = await loadBitmapMask();
  let closestMatch: [number, number] = [0, 0];
  let closestDistance: number = TILESET_CONFIG.MAX_WEIGHTED_DISTANCE;

  for (let y = 0; y < TILESET_CONFIG.NUM_ROWS; y++) {
    for (let x = 0; x < TILESET_CONFIG.TILES_PER_ROW; x++) {
      const tileBitmask = readBitmaskFromBitmap(imageData, x, y);

      if (tileBitmask === targetBitmask) {
        return [x, y];
      }

      const distance = weightedHammingDistance(tileBitmask, targetBitmask);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMatch = [x, y];
      }
    }
  }

  return closestMatch;
}

const tilePositionCache: { [key: string]: [number, number] } = {};
let onCacheUpdate: (() => void) | null = null;

export function setTilesetCacheUpdateCallback(callback: () => void) {
  onCacheUpdate = callback;
}

export function calculateTileSprite(
  type: TileType,
  neighbors: Neighbors
): { x: number; y: number; type: TileType } {
  const bitmask = calculateTileBitmask(neighbors);
  const cacheKey = `${type}_${bitmask}`;

  if (tilePositionCache[cacheKey]) {
    const [x, y] = tilePositionCache[cacheKey];
    return { x, y, type };
  }

  findMatchingTile(bitmask, type).then(([x, y]) => {
    tilePositionCache[cacheKey] = [x, y];
    if (onCacheUpdate) {
      onCacheUpdate();
    }
  });

  return getTileSpriteSync(bitmask, type);
}

function getTileSpriteSync(bitmask: number, type: TileType): { x: number; y: number; type: TileType } {
  const hasTop = (bitmask & (1 << 1)) !== 0;
  const hasRight = (bitmask & (1 << 3)) !== 0;
  const hasBottom = (bitmask & (1 << 5)) !== 0;
  const hasLeft = (bitmask & (1 << 7)) !== 0;

  let x = 0, y = 0;

  if (!hasTop && !hasRight && !hasBottom && !hasLeft) {
    x = 0; y = 0;
  } else if (hasTop && !hasRight && !hasBottom && !hasLeft) {
    x = 1; y = 0;
  } else if (!hasTop && hasRight && !hasBottom && !hasLeft) {
    x = 2; y = 0;
  } else if (!hasTop && !hasRight && hasBottom && !hasLeft) {
    x = 3; y = 0;
  } else if (!hasTop && !hasRight && !hasBottom && hasLeft) {
    x = 4; y = 0;
  } else if (hasTop && !hasRight && hasBottom && !hasLeft) {
    x = 5; y = 0;
  } else if (!hasTop && hasRight && !hasBottom && hasLeft) {
    x = 6; y = 0;
  } else if (hasTop && hasRight && !hasBottom && !hasLeft) {
    x = 7; y = 0;
  } else if (!hasTop && hasRight && hasBottom && !hasLeft) {
    x = 8; y = 0;
  } else if (!hasTop && !hasRight && hasBottom && hasLeft) {
    x = 9; y = 0;
  } else if (hasTop && !hasRight && !hasBottom && hasLeft) {
    x = 10; y = 0;
  } else if (hasTop && hasRight && hasBottom && !hasLeft) {
    x = 11; y = 0;
  } else if (!hasTop && hasRight && hasBottom && hasLeft) {
    x = 12; y = 0;
  } else if (hasTop && !hasRight && hasBottom && hasLeft) {
    x = 13; y = 0;
  } else if (hasTop && hasRight && !hasBottom && hasLeft) {
    x = 14; y = 0;
  } else if (hasTop && hasRight && hasBottom && hasLeft) {
    x = 15; y = 0;
  }

  return { x, y, type };
}

if (typeof window !== "undefined") {
  loadBitmapMask().catch(console.error);
}
