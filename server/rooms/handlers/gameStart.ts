// server/rooms/handlers/gameStart.ts
import type { HospitalRoom } from "../HospitalRoom";

/**
 * Handles the host's "start_game" message, triggering the 3s countdown
 * and initializing hospital stats when it completes.
 */
export function registerGameStartHandlers(room: HospitalRoom) {
  room.onMessage("start_game", (client) => {
    const player = room.state.players.get(client.sessionId);
    if (!player?.isHost || room.state.gameStarted) {
      return;
    }

    console.log("🕒 Host initiated game start; beginning 3s countdown...");
    room.state.gameStarting = true;

    setTimeout(() => {
      // initialize counts
      room.state.hospital.numDoctors = Array
        .from(room.state.players.values())
        .filter(p => !p.isHost).length;

      room.state.hospital.numPatients     = 0;
      room.state.hospital.numDeadPatients = 0;
      room.state.hospital.patientSatisfaction    = 100;

      room.state.gameStarted = true;
      console.log("🎮 Game officially started — hospital stats initialized");
    }, 3000);
  });
}
