export interface Level {
  id: number;
  name: string;
  description: string;
  rows: number;
  cols: number;
  difficulty: string;
  hasCombat: boolean;
  hasKeys: boolean;
  hasObstacles: boolean;
  start: Position;
  end: Position;
  grid: string[][];
  enemies: Enemy[];
  obstacles: Obstacle[];
  items: Item[];
}

export interface Position {
  row: number;
  col: number;
}

export interface Enemy {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
}

export interface Obstacle {
  id: number;
  name: string;
  type: string;
  effect: string;
}

export interface Item {
  id: number;
  name: string;
  type: string;
  effect: string;
}

export interface Highscore {
  id?: number;
  pseudo: string;
  score: number;
  date?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
