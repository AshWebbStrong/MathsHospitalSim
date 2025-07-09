import PhaserGame from '../components/PhaserGame';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';

export default function PlayerGamePage() {
  const { room } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) {
      alert("You've been disconnected.");
      navigate('/'); // Send them to home or join page
    }
  }, [room]);



  return (
    <div className="w-full h-screen">
      {/* Main Phaser game area */}
      <PhaserGame />

      {/* TODO: Add top bar, modals, mini-map overlay */}
    </div>
  );
}
