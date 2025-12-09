import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Maze Game</h1>
      <p className="text-gray-400">Welcome to the Maze Game!</p>
      <Button onClick={handleStartGame}>Start Game</Button>
    </div>
  );
}
