import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function Score() {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate('/');
  };

  return (
    <div className="bg-slate-700 text-white flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Game Over</h1>
      <p className="text-gray-400">Final Score: 0</p>
      <Button onClick={handlePlayAgain}>Play Again</Button>
    </div>
  );
}
