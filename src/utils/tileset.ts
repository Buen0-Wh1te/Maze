/**
 * Tileset autotiling system using dynamic bitmap matching
 * Reads the actual bitmap image to find matching tile patterns
 */

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

// Cached bitmap MASK data - the pattern reference (pink/white), not the decorative tileset
let bitmapMaskCache: ImageData | null = null;

/**
 * Load and cache bitmap MASK image data
 * This is the bitmap.png with pink (connected) and white (not connected) pixels
 * This is SEPARATE from the decorative tileset textures
 */
async function loadBitmapMask(): Promise<ImageData> {
  if (bitmapMaskCache) {
    return bitmapMaskCache;
  }

  // Use the actual bitmap mask image (the reference pattern, not the pretty textures)
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

/**
 * Check if a pixel is white (0) or colored (1)
 * White = RGB values are high (> 200)
 */
function isPixelColored(imageData: ImageData, x: number, y: number): boolean {
  const index = (y * imageData.width + x) * 4;
  const r = imageData.data[index];
  const g = imageData.data[index + 1];
  const b = imageData.data[index + 2];

  // If pixel is mostly white, return false (0)
  // If pixel is colored (pink/red), return true (1)
  return r < 200 || g < 200 || b < 200;
}

/**
 * Read bitmask from a bitmap tile at position (tileX, tileY)
 *
 * Bitmap structure:
 * - 32x32 pixel tiles
 * - 1px gap between tiles
 * - 1px border around entire bitmap
 * - Position formula: border + (tileSize + gap) * index = 1 + 33 * index
 *
 * Checking order (clockwise from top-left):
 * 1. Top-Left pixel (bit 0)
 * 2. Top-Center pixel (bit 1)
 * 3. Top-Right pixel (bit 2)
 * 4. Center-Right pixel (bit 3)
 * 5. Bottom-Right pixel (bit 4)
 * 6. Bottom-Center pixel (bit 5)
 * 7. Bottom-Left pixel (bit 6)
 * 8. Center-Left pixel (bit 7)
 */
function readBitmaskFromBitmap(imageData: ImageData, tileX: number, tileY: number): number {
  const TILE_SIZE = 32;
  const GAP = 1;
  const BORDER = 1;

  // Calculate top-left pixel of the tile
  const startX = BORDER + tileX * (TILE_SIZE + GAP);
  const startY = BORDER + tileY * (TILE_SIZE + GAP);

  // Center of the tile
  const centerX = startX + TILE_SIZE / 2;
  const centerY = startY + TILE_SIZE / 2;

  // Sample points (using edge pixels and corners)
  const topLeftPixel = isPixelColored(imageData, startX + 4, startY + 4);
  const topCenterPixel = isPixelColored(imageData, centerX, startY + 4);
  const topRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, startY + 4);
  const centerRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, centerY);
  const bottomRightPixel = isPixelColored(imageData, startX + TILE_SIZE - 4, startY + TILE_SIZE - 4);
  const bottomCenterPixel = isPixelColored(imageData, centerX, startY + TILE_SIZE - 4);
  const bottomLeftPixel = isPixelColored(imageData, startX + 4, startY + TILE_SIZE - 4);
  const centerLeftPixel = isPixelColored(imageData, startX + 4, centerY);

  // Build bitmask
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

/**
 * Calculate the bitmask value for a tile based on its neighbors
 */
export function calculateTileBitmask(neighbors: Neighbors): number {
  let bitmask = 0;

  // Build bitmask in exact order of bitmap pixel checking (clockwise from top-left)
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

/**
 * Calculate weighted hamming distance between two bitmasks
 * Cardinal directions (T, R, B, L) have much higher weight than diagonals
 *
 * Bit layout:
 * [bit0=TL][bit1=T][bit2=TR]
 * [bit7=L ]   X   [bit3=R ]
 * [bit6=BL][bit5=B][bit4=BR]
 *
 * Weights:
 * - Cardinal mismatch: 10 points each
 * - Diagonal mismatch: 1 point each
 */
function weightedHammingDistance(a: number, b: number): number {
  const xor = a ^ b;
  let distance = 0;

  // Cardinal bits (1, 3, 5, 7) - weight 10 each
  if (xor & (1 << 1)) distance += 10; // Top
  if (xor & (1 << 3)) distance += 10; // Right
  if (xor & (1 << 5)) distance += 10; // Bottom
  if (xor & (1 << 7)) distance += 10; // Left

  // Diagonal bits (0, 2, 4, 6) - weight 1 each
  if (xor & (1 << 0)) distance += 1; // Top-Left
  if (xor & (1 << 2)) distance += 1; // Top-Right
  if (xor & (1 << 4)) distance += 1; // Bottom-Right
  if (xor & (1 << 6)) distance += 1; // Bottom-Left

  return distance;
}

/**
 * Find matching tile in bitmap by comparing bitmasks
 * If exact match not found, returns closest match
 */
async function findMatchingTile(targetBitmask: number, type: TileType): Promise<[number, number]> {
  const imageData = await loadBitmapMask();

  // Bitmap is 397×133 pixels: 12×4 grid of 32px tiles with 1px gaps/border
  // Formula: width = border + (tileSize + gap) * cols + border = 1 + 33*12 + 1 = 398
  // Formula: height = border + (tileSize + gap) * rows + border = 1 + 33*4 + 1 = 134
  const tilesPerRow = 12;
  const numRows = 4;

  let closestMatch: [number, number] = [0, 0];
  let closestDistance = 44; // Max weighted distance: 4 cardinals * 10 + 4 diagonals * 1 = 44

  // Search through bitmap tiles
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < tilesPerRow; x++) {
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

// Cache for bitmask to position mapping
const tilePositionCache: { [key: string]: [number, number] } = {};

/**
 * Calculate sprite position based on tile type and neighbors
 */
export function calculateTileSprite(
  type: TileType,
  neighbors: Neighbors
): { x: number; y: number; type: TileType } {
  const bitmask = calculateTileBitmask(neighbors);
  const cacheKey = `${type}_${bitmask}`;

  // Return cached result if available
  if (tilePositionCache[cacheKey]) {
    const [x, y] = tilePositionCache[cacheKey];
    return { x, y, type };
  }

  // For now, use synchronous fallback (async loading happens in background)
  // This will be replaced with cached values after first load
  findMatchingTile(bitmask, type).then(([x, y]) => {
    tilePositionCache[cacheKey] = [x, y];
  });

  // Temporary fallback using simple logic until bitmap loads
  return getTileSpriteSync(bitmask, type);
}

/**
 * Synchronous fallback for tile sprite calculation
 */
function getTileSpriteSync(bitmask: number, type: TileType): { x: number; y: number; type: TileType } {
  // Simple pattern matching based on cardinals only
  const hasTop = (bitmask & (1 << 1)) !== 0;
  const hasRight = (bitmask & (1 << 3)) !== 0;
  const hasBottom = (bitmask & (1 << 5)) !== 0;
  const hasLeft = (bitmask & (1 << 7)) !== 0;

  let x = 0, y = 0;

  // Basic patterns
  if (!hasTop && !hasRight && !hasBottom && !hasLeft) {
    x = 0; y = 0; // Isolated
  } else if (hasTop && !hasRight && !hasBottom && !hasLeft) {
    x = 1; y = 0; // Top only
  } else if (!hasTop && hasRight && !hasBottom && !hasLeft) {
    x = 2; y = 0; // Right only
  } else if (!hasTop && !hasRight && hasBottom && !hasLeft) {
    x = 3; y = 0; // Bottom only
  } else if (!hasTop && !hasRight && !hasBottom && hasLeft) {
    x = 4; y = 0; // Left only
  } else if (hasTop && !hasRight && hasBottom && !hasLeft) {
    x = 5; y = 0; // Vertical
  } else if (!hasTop && hasRight && !hasBottom && hasLeft) {
    x = 6; y = 0; // Horizontal
  } else if (hasTop && hasRight && !hasBottom && !hasLeft) {
    x = 7; y = 0; // Top-Right L
  } else if (!hasTop && hasRight && hasBottom && !hasLeft) {
    x = 8; y = 0; // Right-Bottom L
  } else if (!hasTop && !hasRight && hasBottom && hasLeft) {
    x = 9; y = 0; // Bottom-Left L
  } else if (hasTop && !hasRight && !hasBottom && hasLeft) {
    x = 10; y = 0; // Left-Top L
  } else if (hasTop && hasRight && hasBottom && !hasLeft) {
    x = 11; y = 0; // T left
  } else if (!hasTop && hasRight && hasBottom && hasLeft) {
    x = 12; y = 0; // T up
  } else if (hasTop && !hasRight && hasBottom && hasLeft) {
    x = 13; y = 0; // T right
  } else if (hasTop && hasRight && !hasBottom && hasLeft) {
    x = 14; y = 0; // T down
  } else if (hasTop && hasRight && hasBottom && hasLeft) {
    x = 15; y = 0; // Cross
  }

  return { x, y, type };
}

// Pre-load bitmap mask
if (typeof window !== "undefined") {
  loadBitmapMask().catch(console.error);
}
