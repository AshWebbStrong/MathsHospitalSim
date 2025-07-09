// src/pages/HostGamePage.tsx

import React, { useEffect, useState } from "react";
import { useRoom } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { HospitalState, PlayerSchema } from "../../../common/HospitalState";
import * as Colyseus from "colyseus.js";

/**
 * Describes the data we display for each player in the table.
 */
interface PlayerInfo {
  sessionId: string;
  name:      string;
  location:  string;
  isHost:    boolean;
}

/**
 * Mirrors the fields on our HospitalSchema so that React
 * state is strongly-typed and self-documenting.
 */
interface HospitalStats {
  name:         string;
  numDoctors:   number;
  numPatients:  number;
  numDead:      number;
  patientSatisfaction: number;
}

export default function HostGamePage() {
  // Pull the active Colyseus room out of context
  const { room } = useRoom();
  const navigate = useNavigate();

  // React state for the player list and hospital stats
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [stats, setStats]     = useState<HospitalStats>({
    name:         "",
    numDoctors:   0,
    numPatients:  0,
    numDead:      0,
    patientSatisfaction: 0,
  });

  /**
   * Synchronize React state with Colyseus state.
   * Runs on mount and whenever room.state changes.
   */
  useEffect(() => {
    // If there's no room (e.g. on hard refresh), kick back to home
    if (!room) {
      navigate("/");
      return;
    }

    /**
     * Pulls players and hospital stats out of the shared state
     * and writes them into React state.
     */
    const rebuild = () => {
      // 1) Build the player list
      const list: PlayerInfo[] = [];
      for (const [sessionId, p] of room.state.players.entries()) {
        list.push({
          sessionId,
          name:      p.name,
          location:  p.location,
          isHost:    p.isHost,
        });
      }
      setPlayers(list);

      // 2) Read hospital stats from state.hospital
      const h = room.state.hospital;
      setStats({
        name:         h.name,
        numDoctors:   h.numDoctors,
        numPatients:  h.numPatients,
        numDead:      h.numDeadPatients,
        patientSatisfaction: h.patientSatisfaction,
      });
    };

    // Run once to initialize
    rebuild();

    // Subscribe to any state change in the room
    room.onStateChange(rebuild);

    // Cleanup: remove all Colyseus listeners when unmounting
    return () => {
      room.removeAllListeners();
    };
  }, [room, navigate]);


  // Generate a new patient
   const manualGenerate = () => {
    room?.send('generate_patient');
  };

  // Render the host’s dashboard
  return (
    <div className="p-6">
      {/* Page title showing the hospital name */}
      <h1 className="text-2xl font-bold mb-4">
        Host Control Panel — {stats.name}
      </h1>

      {/* Summary stats row */}
      <div className="mb-4">
        <strong>Doctors:</strong>     {stats.numDoctors} 
        <strong>Patients:</strong>    {stats.numPatients} 
        <strong>Dead:</strong>        {stats.numDead} 
        <strong>Satisfaction:</strong> {stats.patientSatisfaction}%
      </div>

      {/* Players table */}
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.sessionId}>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.location}</td>
              <td className="border px-4 py-2">
                {p.isHost ? "Host" : "Doctor"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* New: manual generate */}
      <button
        onClick={manualGenerate}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        + Generate Patient
      </button>
    </div>
  );
}
