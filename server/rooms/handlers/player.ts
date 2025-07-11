// server/rooms/handlers/player.ts
import type { HospitalRoom } from "../HospitalRoom";
import { PlayerSchema } from "../../../common/HospitalState";


export function registerPlayerHandlers(room: HospitalRoom) {
  // allow any client to update its own location
  room.onMessage("update_location", (client, payload: { location: string }) => {
    const player = room.state.players.get(client.sessionId);
    if (!player) return;
    player.location = payload.location;
    // (optionally) you could validate location against an allowed list,
    // or broadcast something special here.
  });
}