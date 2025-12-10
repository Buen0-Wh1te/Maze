import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameProvider';
import { BackgroundMusic } from './components/BackgroundMusic';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Score } from './pages/Score';
import backgroundMusic from './assets/musics/background.mp3';

function App() {
  return (
    <GameProvider>
      <BackgroundMusic src={backgroundMusic} volume={0.4} />
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
