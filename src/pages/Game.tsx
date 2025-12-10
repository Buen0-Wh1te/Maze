import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useGame } from '../hooks/useGame';

export function Game() {
  const navigate = useNavigate();
  const { pseudo } = useGame();

  const handleEndGame = () => {
    navigate('/score');
  };

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Game</h1>
      <p className="text-gray-400">Playing as: {pseudo}</p>
      <p className="text-gray-400">Game screen - Grid will be displayed here</p>
      <Button onClick={handleEndGame}>End Game</Button>
    </div>
  );
}
