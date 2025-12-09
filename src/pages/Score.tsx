import { useNavigate } from 'react-router-dom';

export function Score() {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Game Over</h1>
      <p>Final Score: 0</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
}
