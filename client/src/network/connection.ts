import * as Colyseus from 'colyseus.js';
import type { HospitalState, Player } from '../types/HospitalTypes';

const client = new Colyseus.Client('ws://localhost:2567'); // replace with env for prod


// Looks up the internal roomId from the custom roomCode (5-letter code)
export const findRoomIdByCode = async (roomCode: string): Promise<string | null> => {
  try {
    const res = await fetch('http://localhost:2567'); // same as your Express GET /
    const rooms = await res.json();

    const found = rooms.find((room: any) => room.metadata?.roomCode === roomCode.toUpperCase());
    return found ? found.roomId : null;
  } catch (err) {
    console.error('❌ Failed to fetch room list:', err);
    return null;
  }
};

// Joins the room by internal ID, after you've already resolved it via findRoomIdByCode
  export const joinHospitalRoom = async (
    playerName: string,
    roomId?: string,
    role: 'host' | 'player' = 'player',
    roomCode?: string // ✅ Add roomCode only for host
  ) => {
    
    try {
      const room: Colyseus.Room<HospitalState> = roomId
        ? await client.joinById<HospitalState>(roomId, { name: playerName, role })
        : await client.create<HospitalState>('hospital_room', { name: playerName, role, roomCode });

      return { room };
    } catch (e) {
      console.error('Join failed:', e);
      throw e;
    }
};

