import type { Level, Enemy, Obstacle, Item, Highscore } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let isLoading = false;
let apiError: string | null = null;

async function fetchJson<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

  return response.json();
  }
  catch (err: any) {
    apiError = err.message || 'Error API call';
    throw err;
  } 
  finally{
    isLoading = false;
  }
}

export async function fetchLevels(): Promise<Level[]> {
  return fetchJson<Level[]>('/api/levels');
}

export async function fetchLevel(id: number): Promise<Level> {
  return fetchJson<Level>(`/api/levels/${id}`);
}

export async function fetchEnemies(): Promise<Enemy[]> {
  return fetchJson<Enemy[]>('/api/enemies');
}

export async function fetchObstacles(): Promise<Obstacle[]> {
  return fetchJson<Obstacle[]>('/api/obstacles');
}

export async function fetchItems(): Promise<Item[]> {
  return fetchJson<Item[]>('/api/items');
}

export async function fetchHighscores(): Promise<Highscore[]> {
  return fetchJson<Highscore[]>('/api/highscores');
}

export async function postHighscore(highscore: Highscore): Promise<Highscore> {
  isLoading = true;
  apiError = null;
  try{
    const response = await fetch(`${API_BASE_URL}/api/highscores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(highscore),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
  catch (err: any) {
    apiError = err.message || 'Error sending highscore';
    throw err;
  }
  finally {
    isLoading = false;
  }
}
