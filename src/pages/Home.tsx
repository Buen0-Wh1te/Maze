import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div>
      <h1>Maze Game</h1>
      <p>Welcome to the Maze Game!</p>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}
