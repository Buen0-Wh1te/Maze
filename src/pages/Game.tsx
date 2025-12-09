import { useNavigate } from 'react-router-dom';

export function Game() {
  const navigate = useNavigate();

  const handleEndGame = () => {
    navigate('/score');
  };

  return (
    <div>
      <h1>Game</h1>
      <p>Game screen - Grid will be displayed here</p>
      <button onClick={handleEndGame}>End Game</button>
    </div>
  );
}
