import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameProvider';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Score } from './pages/Score';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/score" element={<Score />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
