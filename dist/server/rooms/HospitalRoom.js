"use strict";
// server/rooms/HospitalRoom.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalRoom = void 0;
const colyseus_1 = require("colyseus");
const uuid_1 = require("uuid");
const HospitalState_1 = require("../../common/HospitalState");
const HospitalEngine_1 = require("../engine/HospitalEngine");
const handlers_1 = require("./handlers");
/**
 * The Colyseus Room handling all logic for a single hospital game session.
 */
class HospitalRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        /** Session ID of the host client; used for host-only checks. */
        this.hostClientId = null;
    }
    /** onCreate is called once when the room is first instantiated. Here we set metadata, initialize state, and wire up message handlers. */
    onCreate(options) {
        var _a;
        console.log("🛠 Room creation options:", options);
        // Public roomCode for clients to share, and maxPlayers for lobby limit.
        const roomCode = options.roomCode || this.roomId;
        const maxPlayers = (_a = options.maxPlayers) !== null && _a !== void 0 ? _a : 4;
        this.setMetadata({ roomCode, maxPlayers });
        // Creates a fresh HospitalState, including the embedded HospitalSchema.
        this.state = new HospitalState_1.HospitalState();
        console.log(`✅ HospitalRoom created (code=${roomCode}, maxPlayers=${maxPlayers})`);
        // 1) Spin-up the engine
        this.engine = new HospitalEngine_1.HospitalEngine(this.state, /* tickRateMs= */ 1000);
        // 2) Delegates onMessage registrations to separate modules (e.g. set_hospital_name, start_game).
        (0, handlers_1.registerAllHandlers)(this);
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
    onJoin(client, options) {
        // — Sanitize & constrain the player name
        const rawName = options.name || "PLAYER";
        const name = rawName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 7);
        const isHost = options.role === "host";
        // — Enforce maxPlayers: count only non-host players
        const nonHostCount = Array.from(this.state.players.values())
            .filter(p => !p.isHost).length;
        if (!isHost && nonHostCount >= this.metadata.maxPlayers) {
            console.log(`🚫 Room full: rejecting ${name}`);
            client.leave(1000, "Room is full.");
            return;
        }
        // — Add the new player to the shared state
        const newPlayer = new HospitalState_1.PlayerSchema();
        newPlayer.name = name;
        newPlayer.location = "lobby";
        newPlayer.id = client.sessionId;
        newPlayer.isHost = isHost;
        this.state.players.set(client.sessionId, newPlayer);
        // — If this client is the host, remember their sessionId and send roomCode
        if (isHost) {
            this.hostClientId = client.sessionId;
            client.send("room_code", { roomCode: this.metadata.roomCode });
            console.log(`👤 ${name} joined as HOST`);
        }
        else {
            console.log(`👤 ${name} joined as PLAYER`);
        }
        // — Recompute and store the number of doctors (non-hosts)
        this.updateDoctorCount();
    }
    /**
     * onLeave is called whenever a client disconnects or is kicked.
     */
    onLeave(client, consented) {
        const player = this.state.players.get(client.sessionId);
        if (!player) {
            console.warn(`⚠️ Tried to remove non-existent player ${client.sessionId}`);
            return;
        }
        // — If the host leaves, notify everyone and dispose the room
        if (player.isHost) {
            this.broadcast("host_left", { reason: "Host has left the room." });
            this.disconnect(); // triggers onDispose()
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
    updateDoctorCount() {
        this.state.hospital.numDoctors = Array.from(this.state.players.values())
            .filter(p => !p.isHost).length;
    }
    generatePatient() {
        const p = new HospitalState_1.PatientSchema();
        p.id = (0, uuid_1.v4)();
        p.name = `Patient ${p.id.slice(0, 4)}`;
        p.age = Math.floor(Math.random() * 60) + 20;
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
exports.HospitalRoom = HospitalRoom;
