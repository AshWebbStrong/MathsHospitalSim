import React, { useEffect, useState, useRef } from 'react';
import { useRoom } from '../context/RoomContext';
import * as Colyseus from 'colyseus.js';
import { useNavigate } from 'react-router-dom';
import type { Player, HospitalState } from '../types/HospitalTypes';
import { useLocation } from 'react-router-dom';
import { PlayerSchema } from '../types/PlayerSchema';
import { MapSchema } from '@colyseus/schema';

const client = new Colyseus.Client('ws://localhost:2567');

interface PlayerInfo {
  sessionId: string;
  name: string;
}


export default function HostLobbyPage() {
    const { room } = useRoom();
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
    if (!room) {
        navigate('/');
        return;
    }

    
    const typedRoom = room as unknown as Colyseus.Room<{
    players: MapSchema<PlayerSchema>;
    }>;

    const passedRoomCode = (location.state as any)?.roomCode;
        if (passedRoomCode) {
        console.log("📦 Set room code from router state:", passedRoomCode);
        setRoomCode(passedRoomCode);
        }

    room.onStateChange(() => {
        updatePlayersList(room);
    });
    

    room.onMessage('host_left', (message) => {
        alert(message.reason || 'Room closed.');
        navigate('/');
    });

    const handleUnload = () => {
        room.leave();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
        window.removeEventListener('beforeunload', handleUnload);
        
    };
    }, [room]);




    function updatePlayersList(roomInstance: Colyseus.Room<HospitalState>) {
    if (!roomInstance.state || !roomInstance.state.players) return;

    const statePlayers = roomInstance.state.players as Map<string, Player>;
    const newPlayers: PlayerInfo[] = [];

    for (const [sessionId, player] of statePlayers.entries()) {
        if (!player.isHost) {
        newPlayers.push({ sessionId, name: player.name });
        }
    }

    setPlayers(newPlayers);
    }

  return (
    <div>
      <h1>Host Lobby</h1>
      {roomCode ? (
        <>
          <p>Share this Room Code with players:</p>
          <h2>{roomCode}</h2>
          <p>Waiting for players to join...</p>

          <h3>Players in Lobby:</h3>
          {players.length === 0 && <p>No players joined yet.</p>}
          <ul>
            {players.map((player) => (
              <li key={player.sessionId}>{player.name}</li>
            ))}
          </ul>

          {/* TODO: Add Start Game button here */}
        </>
      ) : (
        <p>Creating room...</p>
      )}
    </div>
  );
}
