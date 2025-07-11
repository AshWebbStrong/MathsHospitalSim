"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPatientHandlers = registerPatientHandlers;
function registerPatientHandlers(room) {
    // 1) Manual trigger: host clicks “Generate Patient”
    room.onMessage("generate_patient", (client) => {
        const player = room.state.players.get(client.sessionId);
        if (!(player === null || player === void 0 ? void 0 : player.isHost))
            return;
        room.generatePatient();
    });
    // 2) Let host update the interval while still in lobby
    room.onMessage("set_patient_interval", (client, { interval }) => {
        const player = room.state.players.get(client.sessionId);
        if (!(player === null || player === void 0 ? void 0 : player.isHost))
            return;
        // enforce minimum
        const ms = Math.max(1000, interval);
        room.state.hospital.patientGenerationInterval = ms;
        console.log(`[patient.ts] Host set patientGenerationInterval → ${ms}ms`);
        // If the game has already started, we should reschedule the next generation:
        if (room.state.gameStarted) {
            // cancel the pending “next patient” event
            if (room._nextPatientEventId) {
                room.engine.cancel(room._nextPatientEventId);
            }
            // schedule a fresh one at the new interval
            room._nextPatientEventId = room.engine.schedule(ms, () => {
                room.generatePatient();
                // and re‐schedule recursively
                room._nextPatientEventId = room.engine.schedule(room.state.hospital.patientGenerationInterval, arguments.callee);
            });
            console.log(`[patient.ts] Rescheduled next patient with new interval`);
        }
    });
    // 3) Select a patient when clicking on them
    room.onMessage("select_patient", (client, { patientId }) => {
        const player = room.state.players.get(client.sessionId);
        if (!player)
            return;
        console.log(`👨‍⚕️ Player ${player.name} wants to triage patient ${patientId}`);
        // TODO: validate patient exists, change its state, broadcast updates, etc.
        // For now we’ll just log it so the socket stays open.
    });
    // 4) Transport a patient when clicking on a new room for them)
    room.onMessage("transfer_patient", (client, { patientId, location }) => {
        const patient = room.state.hospital.patients.find(p => p.id === patientId);
        if (!patient)
            return;
        console.log(`↔️ Moving ${patientId} → ${location}`);
        patient.location = location;
    });
}
