import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayerJoinPage from './pages/PlayerJoinPage';
import PlayerGamePage from './pages/PlayerGamePage';
import HostGamePage from './pages/HostGamePage';
import LobbyPage from './pages/LobbyPage';
import './App.css'

function App() {




  return (
    <div className="h-full flex flex-col">  {/* ← must be h-full */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<PlayerJoinPage />} />
          <Route path="/game" element={<PlayerGamePage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/host-game" element={<HostGamePage />} />
        </Routes>
      </Router>
      </div>
    );
}

export default App
