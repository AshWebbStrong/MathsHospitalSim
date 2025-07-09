// RoomContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { HospitalState, PlayerSchema } from '../../../common/HospitalState';
import * as Colyseus from 'colyseus.js';

type RoomType = Colyseus.Room<HospitalState> | null;

// Define the shape of our context
interface RoomContextType {
  room: Colyseus.Room<HospitalState> | null;
  setRoom: (room: Colyseus.Room<HospitalState> | null) => void;
}

// Create the context object
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Create the context provider (wraps the whole app)
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<RoomType>(null);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

// This function gives components access to the room
export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) throw new Error('useRoom must be used within RoomProvider');
  return context;
};
