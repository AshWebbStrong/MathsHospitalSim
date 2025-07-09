// frontend/types/HospitalTypes.ts

export interface Player {
  id: string;
  name: string;
  location: string;
  isHost: boolean;
}

export interface HospitalState {
  players: Map<string, Player>;
  gameStarted: boolean;
}

export interface HospitalRoomMetadata {
  roomCode: string;
  hostName?: string;
}
