// server/rooms/HospitalRoom.ts

import { Room, Client } from "colyseus";
import { HospitalState, PlayerSchema } from "../../common/HospitalState";
import { registerAllHandlers } from "./handlers";

/**
 * The Colyseus Room handling all logic for a single hospital game session.
 * We delegate domain-specific message handlers to modules under ./handlers,
 * and keep join/leave/business logic here.
 */
export class HospitalRoom extends Room<HospitalState> {
  /** Session ID of the host client; used for host-only checks. */
  hostClientId: string | null = null;

  /**
   * onCreate is called once when the room is first instantiated.
   * Here we set metadata, initialize state, and wire up message handlers.
   */
  onCreate(options: any) {
    console.log("🛠 Room creation options:", options);

    // ─── 1) Metadata ─────────────────────────────────────────────────────
    // Public roomCode for clients to share, and maxPlayers for lobby limit.
    const roomCode   = options.roomCode   || this.roomId;
    const maxPlayers = options.maxPlayers ?? 4;
    this.setMetadata({ roomCode, maxPlayers });

    // ─── 2) Initialize State ─────────────────────────────────────────────
    // Creates a fresh HospitalState, including the embedded HospitalSchema.
    this.state = new HospitalState();
    console.log(`✅ HospitalRoom created (code=${roomCode}, maxPlayers=${maxPlayers})`);

    // ─── 3) Register Message Handlers ────────────────────────────────────
    // Delegates onMessage registrations to separate modules (e.g. set_hospital_name, start_game).
    registerAllHandlers(this);
  }

  /**
   * onJoin runs whenever a client successfully connects.
   * We sanitize the player's name, enforce the lobby limit, track host vs player,
   * and update the doctor count in the shared hospital state.
   */
  onJoin(client: Client, options: any) {
    // — Sanitize & constrain the player name
    const rawName = options.name || "PLAYER";
    const name = rawName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 7);
    const isHost = options.role === "host";

    // — Enforce maxPlayers: count only non-host players
    const nonHostCount = Array.from(this.state.players.values())
      .filter(p => !p.isHost).length;
    if (!isHost && nonHostCount >= (this.metadata as any).maxPlayers) {
      console.log(`🚫 Room full: rejecting ${name}`);
      client.leave(1000, "Room is full.");
      return;
    }

    // — Add the new player to the shared state
    const newPlayer = new PlayerSchema();
    newPlayer.name     = name;
    newPlayer.location = "lobby";
    newPlayer.id       = client.sessionId;
    newPlayer.isHost   = isHost;
    this.state.players.set(client.sessionId, newPlayer);

    // — If this client is the host, remember their sessionId and send roomCode
    if (isHost) {
      this.hostClientId = client.sessionId;
      client.send("room_code", { roomCode: (this.metadata as any).roomCode });
      console.log(`👤 ${name} joined as HOST`);
    } else {
      console.log(`👤 ${name} joined as PLAYER`);
    }

    // — Recompute and store the number of doctors (non-hosts)
    this.updateDoctorCount();
  }

  /**
   * onLeave is called whenever a client disconnects or is kicked.
   * We handle host departure (ending the room) and player departure,
   * removing them from state and updating counts.
   */
  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (!player) {
      console.warn(`⚠️ Tried to remove non-existent player ${client.sessionId}`);
      return;
    }

    // — If the host leaves, notify everyone and dispose the room
    if (player.isHost) {
      this.broadcast("host_left", { reason: "Host has left the room." });
      this.disconnect();  // triggers onDispose()
      return;
    }

    // — Otherwise, remove the player and update counts
    this.state.players.delete(client.sessionId);
    console.log(`👋 Player left: ${player.name}`);
    this.updateDoctorCount();
  }

  /**
   * Recomputes the number of doctors (non-host players) and writes it
   * into the shared hospital schema for all clients to see.
   */
  private updateDoctorCount() {
    this.state.hospital.numDoctors = Array.from(this.state.players.values())
      .filter(p => !p.isHost).length;
  }

  /**
   * onDispose is called when the room is cleaned up (after host leaves).
   */
  onDispose() {
    console.log("🗑️ HospitalRoom disposed");
  }
}
