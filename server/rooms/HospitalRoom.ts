// server/rooms/HospitalRoom.ts

import { Room, Client } from "colyseus";
import { v4 as uuidv4 } from "uuid";
import { HospitalState, PlayerSchema, PatientSchema } from "../../common/HospitalState";
import { HospitalEngine } from "../engine/HospitalEngine";
import { registerAllHandlers } from "./handlers";

/**
 * The Colyseus Room handling all logic for a single hospital game session.
 */
export class HospitalRoom extends Room<HospitalState> {

  public engine!: HospitalEngine;
  /** Session ID of the host client; used for host-only checks. */
  hostClientId: string | null = null;

   /** onCreate is called once when the room is first instantiated. Here we set metadata, initialize state, and wire up message handlers. */
   
  onCreate(options: any) {
    console.log("🛠 Room creation options:", options);

    // Public roomCode for clients to share, and maxPlayers for lobby limit.
    const roomCode   = options.roomCode   || this.roomId;
    const maxPlayers = options.maxPlayers ?? 4;
    this.setMetadata({ roomCode, maxPlayers });

    // Creates a fresh HospitalState, including the embedded HospitalSchema.
    this.state = new HospitalState();
    console.log(`✅ HospitalRoom created (code=${roomCode}, maxPlayers=${maxPlayers})`);


    // 1) Spin-up the engine
    this.engine = new HospitalEngine(this.state, /* tickRateMs= */ 1000);


    // 2) Delegates onMessage registrations to separate modules (e.g. set_hospital_name, start_game).
    registerAllHandlers(this);

    
    // 3) When game ends or host stops, call this.engine.stop()
    this.onMessage("end_game", (c) => {
      this.broadcast("game_over");
      this.engine.stop();
      this.disconnect();
    });
  }


  /**
   * onJoin runs whenever a client successfully connects.
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


  public _nextPatientEventId?: string;
  public generatePatient() {
    const p = new PatientSchema();
    p.id     = uuidv4();
    p.name   = `Patient ${p.id.slice(0,4)}`;
    p.age    = Math.floor(Math.random() * 60) + 20;
    p.gender = Math.random() < 0.5 ? "male" : "female";

    p.location = "triage";

    this.state.hospital.patients.push(p);
    this.state.hospital.numPatients++;
    console.log(`➕ [Engine] New patient: ${p.name}`);
  }

  /**
   * onDispose is called when the room is cleaned up (after host leaves).
   */
  onDispose() {
    this.engine.stop();
    console.log("🗑️ HospitalRoom disposed");
  }
}
