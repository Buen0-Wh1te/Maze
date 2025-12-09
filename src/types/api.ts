export interface Level {
  id: number;
  name: string;
  difficulty: string;
  width: number;
  height: number;
  grid: string[][];
  startPosition: Position;
  endPosition: Position;
}

export interface Position {
  x: number;
  y: number;
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
