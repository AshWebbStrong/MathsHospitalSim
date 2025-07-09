// src/pages/LobbyPage.tsx
import React, { useEffect, useState } from 'react';
import { useRoom }        from '../context/RoomContext';
import { useNavigate,
         useLocation }    from 'react-router-dom';
import { HospitalState }   from '../../../common/HospitalState';

interface PlayerInfo {
  sessionId: string;
  name:      string;
  isHost:    boolean;
}

export default function LobbyPage() {
  const { room } = useRoom();
  const navigate = useNavigate();
  const location = useLocation();

  // — Hospital & lobby UI state
  const [hospitalName, setHospitalName]     = useState<string>('');
  const [intervalSeconds, setIntervalSeconds] = useState<number>(20);
  const [players, setPlayers]               = useState<PlayerInfo[]>([]);
  const [roomCode, setRoomCode]             = useState<string | null>(null);
  const [countdown, setCountdown]           = useState<number | null>(null);

  // — Detect if this client is the host
  const me     = room?.sessionId ? room.state.players.get(room.sessionId) : null;
  const isHost = me?.isHost ?? false;

  useEffect(() => {
    if (!room) {
      navigate('/');
      return;
    }

    // 1) Room code from router-state or metadata
    const passedCode = (location.state as any)?.roomCode;
    if (passedCode) {
      setRoomCode(passedCode);
    } else {
      const meta = (room as any).metadata as { roomCode?: string };
      if (meta?.roomCode) {
        setRoomCode(meta.roomCode);
      }
    }

    // 2) Sync function: players, hospital name, and interval
    const syncAll = () => {
      // — players list
      const list: PlayerInfo[] = [];
      for (const [id, p] of room.state.players.entries()) {
        list.push({ sessionId: id, name: p.name, isHost: p.isHost });
      }
      setPlayers(list);

      // — hospital name
      setHospitalName(room.state.hospital.name);

      // — interval (ms → s)
      const ms = room.state.hospital.patientGenerationInterval;
      setIntervalSeconds(Math.round(ms / 1000));
    };

    // run once on mount
    syncAll();

    // 3) Track previous flags for countdown/navigation
    let prevStarting = room.state.gameStarting;
    let prevStarted  = room.state.gameStarted;

    // 4) Listen to all state changes
    const onStateChange = () => {
      syncAll();

      // countdown trigger
      if (!prevStarting && room.state.gameStarting) {
        let t = 3;
        setCountdown(t);
        const iv = setInterval(() => {
          t -= 1;
          setCountdown(t);
          if (t <= 0) clearInterval(iv);
        }, 1000);
      }
      prevStarting = room.state.gameStarting;

      // navigation trigger
      if (!prevStarted && room.state.gameStarted) {
        const me = room.state.players.get(room.sessionId!);
        if (me?.isHost) navigate('/host-game');
        else          navigate('/game');
      }
      prevStarted = room.state.gameStarted;
    };
    room.onStateChange(onStateChange);

    // 5) Optional message handlers
    const onRoomCode = (data: any) => {
      if (data.roomCode) setRoomCode(data.roomCode);
    };
    const onHostLeft = (msg: any) => {
      alert(msg.reason || 'Room closed.');
      navigate('/');
    };
    room.onMessage('room_code', onRoomCode);
    room.onMessage('host_left', onHostLeft);

    // 6) Cleanup on unmount
    const unloadHandler = () => room.leave();
    window.addEventListener('beforeunload', unloadHandler);
    return () => {
      window.removeEventListener('beforeunload', unloadHandler);
      room.removeAllListeners();
    };
  }, [room, navigate, location]);

  // — Host-only: start game
  const handleStart = () => room?.send('start_game');

  // — Host-only: update auto‐generate interval (seconds → ms)
  const updateInterval = (secs: number) => {
    setIntervalSeconds(secs);
    room?.send('set_patient_interval', { interval: secs * 1000 });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Lobby</h1>

      {roomCode && (
        <div className="mb-2">
          <strong>Room Code:</strong> {roomCode}
        </div>
      )}

      {/* Host can edit hospital name */}
      {isHost ? (
        <div className="mb-4">
          <label className="block mb-1"><strong>Hospital Name:</strong></label>
          <input
            type="text"
            value={hospitalName}
            onChange={e => {
              const name = e.target.value;
              setHospitalName(name);
              room?.send('set_hospital_name', { name });
            }}
            placeholder="Enter hospital name"
            className="border px-2 py-1 w-full"
          />
        </div>
      ) : (
        /* Players just see the name */
        hospitalName && (
          <div className="mb-4">
            <strong>Hospital:</strong> {hospitalName}
          </div>
        )
      )}

      {/* Auto‐generate interval (host editable in seconds) */}
      <div className="mb-4">
        <label>
          Auto-generate patient every:&nbsp;
          {isHost ? (
            <input
              type="number"
              min={1}
              value={intervalSeconds}
              onChange={e => {
                const val = Number(e.target.value);
                if (!isNaN(val) && val > 0) updateInterval(val);
              }}
              className="border px-2 py-1 w-20"
            />
          ) : (
            /* read-only for players */
            <span className="inline-block w-20 text-center">
              {intervalSeconds}
            </span>
          )}
        </label>
        <span> seconds</span>
      </div>

      {/* Players in lobby */}
      <h2 className="text-xl mb-2">Players</h2>
      <ul className="list-disc pl-5 mb-4">
        {players.map(p => (
          <li key={p.sessionId}>
            {p.name} {p.isHost && <em>(Host)</em>}
          </li>
        ))}
      </ul>

      {/* Countdown display */}
      {countdown !== null && countdown > 0 && (
        <h3 className="text-2xl mb-4">Game starting in {countdown}…</h3>
      )}

      {/* Start button for host; waiting message for players */}
      {isHost ? (
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Game
        </button>
      ) : (
        <p>Waiting for host to start…</p>
      )}
    </div>
  );
}
