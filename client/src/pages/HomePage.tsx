// HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { joinHospitalRoom } from '../network/connection';
import { generateRoomCode } from '../utils/generateRoomCode';

export default function HomePage() {
  const { setRoom } = useRoom();
  const navigate = useNavigate();

  const handleHostClick = async () => {
    const generatedCode = generateRoomCode();
    try {

        const { room } = await joinHospitalRoom('Host', undefined, 'host', generatedCode);
        setRoom(room);
        navigate('/lobby', { state: { roomCode: generatedCode} }); // 👈 pass roomCode via router state


    } catch (e) {
      alert('Failed to create room.');
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🏥 Hospital Math Sim</h1>
      <p className="mb-6">Choose your role to begin:</p>
      <div className="space-x-4">
        <button onClick={handleHostClick} className="bg-blue-500 text-white px-4 py-2 rounded">
          Host
        </button>
        <a href="/join" className="bg-green-500 text-white px-4 py-2 rounded">
          Join
        </a>
      </div>
    </div>
  );
}
