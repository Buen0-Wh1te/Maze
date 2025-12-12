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
  type: string;
  name: string;
  hp: number;
  attack: number;
  description: string;
  icon?: string;
}

export interface Obstacle {
  type: string;
  name: string;
  requiredItem: string;
  description: string;
  icon?: string;
}

export interface Item {
  id: string;
  kind: "key" | "item";
  color?: string;
  name: string;
  description: string;
  icon?: string;
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
