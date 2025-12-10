export interface Score {
  pseudo: string;
  tilesRevealed: number;
  moves: number;
  timeElapsed: number;
  totalScore: number;
  date: string;
  levelId: number;
}

const SCORES_KEY = 'maze-highscores';
const MAX_SCORES = 10;

export const saveScore = (score: Omit<Score, 'date'>, levelId: number): void => {
  const scores = getScores();
  const newScore: Score = {
    ...score,
    date: new Date().toISOString(),
    levelId,
  };

  scores.push(newScore);
  scores.sort((a, b) => b.totalScore - a.totalScore);

  const topScores = scores.slice(0, MAX_SCORES);
  localStorage.setItem(SCORES_KEY, JSON.stringify(topScores));
};

export const getScores = (): Score[] => {
  const stored = localStorage.getItem(SCORES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const clearScores = (): void => {
  localStorage.removeItem(SCORES_KEY);
};
