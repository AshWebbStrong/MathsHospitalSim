import React, { useState, useEffect } from 'react';
import { useRoom } from '../context/RoomContext';
import { joinHospitalRoom, findRoomIdByCode } from '../network/connection';
import { useNavigate } from 'react-router-dom';

export default function PlayerJoinPage() {
  const { room, setRoom } = useRoom();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
    alert('Please enter both name and room code.');
    return;
    }


    try {
      const internalRoomId = await findRoomIdByCode(roomCode);
      if (!internalRoomId) {
        alert('Room code not found. Please double-check.');
        return;
      }

      const { room: joinedRoom } = await joinHospitalRoom(playerName, internalRoomId, 'player');
      setRoom(joinedRoom);
      navigate('/game');
    } catch (e) {
      alert('Failed to join room. Please try again.');
    }
  };

  useEffect(() => {
    if (!room) return;

    const handleRoomDispose = (message: any) => {
      alert(message?.reason || 'Room closed.');
      navigate('/');
    };

     room.onMessage('host_left', handleRoomDispose); // ✅ attach

  }, [room]);

  return (
    <div>
      <h1>Join Game</h1>
      <input
        placeholder="Your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        placeholder="Room code (e.g., ABC12)"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}
