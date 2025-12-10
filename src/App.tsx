import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameProvider';
import { AudioProvider } from './context/AudioProvider';
import { BackgroundMusic } from './components/BackgroundMusic';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Score } from './pages/Score';
import backgroundMusic from './assets/musics/background.mp3';

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <BackgroundMusic src={backgroundMusic} volume={0.15} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/score" element={<Score />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;
