import React, { useEffect, useState } from 'react';
import { useRoom } from '../context/RoomContext';

interface ToolbarProps {
  onMapClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onMapClick }) => {
  const { room } = useRoom();
  const [time, setTime] = useState(() => new Date());

  // update clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // safely grab our own sessionId from the Room
  const mySessionId = room?.sessionId;
  const player = mySessionId
    ? room!.state.players.get(mySessionId)
    : undefined;

  const location     = player?.location     ?? 'unknown';
  const hospitalName = room?.state.hospital.name    ?? '';
  const dangerCode   = room?.state.hospital.dangerCode ?? '';

  return (
    <div className="w-full bg-gray-800 text-white flex items-center h-12 px-4 space-x-4">
      <div className="w-1/5 text-center">{location}</div>
      <div className="w-1/5 text-center">{dangerCode}</div>
      <div className="w-1/5 text-center font-bold">{hospitalName}</div>
      <div className="w-1/5 text-center">
        {time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
      <button
        onClick={onMapClick}
        className="w-1/5 bg-blue-600 hover:bg-blue-700 rounded h-8"
      >
        Map
      </button>
    </div>
  );
};

export default Toolbar;
