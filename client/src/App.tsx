import { useState, useEffect,useRef } from 'react'
import { joinHospitalRoom } from './network/connection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HostLobbyPage from './pages/HostLobbyPage';
import PlayerJoinPage from './pages/PlayerJoinPage';
import PlayerGamePage from './pages/PlayerGamePage';
import './App.css'

function App() {




  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostLobbyPage />} />
          <Route path="/join" element={<PlayerJoinPage />} />
          <Route path="/game" element={<PlayerGamePage />} />
        </Routes>
      </Router>
    );
}

export default App
