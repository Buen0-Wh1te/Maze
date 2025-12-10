import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useGame } from '../hooks/useGame';

export function Home() {
  const navigate = useNavigate();
  const { pseudo, setPseudo } = useGame();

  const handleStartGame = () => {
    if (pseudo.trim()) {
      navigate('/game');
    }
  };

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Maze Game</h1>
      <p className="text-gray-400">Welcome to the Maze Game!</p>
      <p>
        The goal of the game is to find the exit by lifting the tiles to reveal
        the path, you can only reveal tiles adjacent to the one already
        revealed.
      </p>
      <input
        type="text"
        placeholder="Enter your pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500 focus:border-pink-800 focus:outline-none"
      />
      <Button onClick={handleStartGame} disabled={!pseudo.trim()}>
        Start Game
      </Button>
    </div>
  );
}
