export const TILE_SIZE = 32;
export const TILE_GAP = 1;
export const TILE_BORDER = 1;
export const AUDIO_VOLUMES = {
  BACKGROUND_MUSIC: 0.15,
  SOUND_EFFECTS: 0.6,
  INPUT_SOUND: 0.6,
} as const;

export const AUDIO_PLAYBACK_RATE = {
  MIN: 0.8,
  MAX: 1.2,
} as const;

export const GAME_LAYOUT = {
  MAX_SCALE: 3,
  SCREEN_WIDTH_RATIO: 0.9,
  HEADER_FOOTER_HEIGHT: 280,
} as const;

export const SCORE_FACTORS = {
  TILES_REVEALED_MULTIPLIER: 10,
  MOVES_PENALTY: 2,
  TIME_PENALTY: 1,
} as const;
export const TILE_TYPES = {
  PATH: "C",
  START: "S",
  END: "E",
  WALL: "W",
  MONSTER: "M",
  KEY: "K",
  DOOR: "D",
  ARMOR: "A",
  OBSTACLE: "O",
} as const;

export const PATH_TILE_TYPES = [
  TILE_TYPES.PATH,
  TILE_TYPES.START,
  TILE_TYPES.END,
  TILE_TYPES.MONSTER,
  TILE_TYPES.KEY,
  TILE_TYPES.DOOR,
  TILE_TYPES.ARMOR,
  TILE_TYPES.OBSTACLE,
] as const;

export const TILESET_CONFIG = {
  TILES_PER_ROW: 12,
  NUM_ROWS: 4,
  MAX_WEIGHTED_DISTANCE: 44,
} as const;

export const BITMASK_WEIGHTS = {
  CARDINAL: 10,
  DIAGONAL: 1,
} as const;

export const PLAYER_SPRITE_CONFIG = {
  SIZE_MULTIPLIER: 1.2,
  MOVEMENT_DURATION_MS: 600,
  FRAME_DELAY_RUNNING_MS: 100,
  FRAME_DELAY_IDLE_MS: 150,
} as const;

export const GRADIENT_GOLD = "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)";
export const MASK_GRADIENT = "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)";

export const BACKGROUND_STYLE = {
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
} as const;
