import type { Position, Level, Item } from "./api";

export type TileType =
  | "S" // Start
  | "E" // End/Exit
  | "C" // Chemin (Path)
  | "W" // Wall
  | "M" // Monster
  | "K" // Key
  | "D" // Door
  | "A" // Weapon/Armor
  | "O"; // Obstacle

export type GameStatus = "playing" | "victory" | "defeat";

export interface Player {
  position: Position;
  hp: number;
  maxHp: number;
  inventory: Inventory;
}

export interface Inventory {
  keys: string[]; // Color keys collected
  weapon: Item | null;
  items: Item[];
}

export interface TileState {
  position: Position;
  type: TileType;
  content: string; // API content
  revealed: boolean;
}

export interface GameState {
  level: Level;
  player: Player;
  tiles: TileState[][];
  status: GameStatus;
  score: number;
  tilesRevealed: number;
}
