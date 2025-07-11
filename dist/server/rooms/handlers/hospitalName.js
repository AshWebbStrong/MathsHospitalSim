"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHospitalNameHandlers = registerHospitalNameHandlers;
/**
 * All message handlers relating to setting or broadcasting
 * the hospital's name.
 */
function registerHospitalNameHandlers(room) {
    room.onMessage("set_hospital_name", (client, { name }) => {
        const player = room.state.players.get(client.sessionId);
        // only host may rename
        if (!(player === null || player === void 0 ? void 0 : player.isHost)) {
            console.warn("❌ Non-host attempted to set hospital name");
            return;
        }
        // sanitize / enforce max length
        const sanitized = name.trim().slice(0, 30);
        room.state.hospital.name = sanitized;
        // optional broadcast for immediacy
        room.broadcast("hospital_name_updated", { name: sanitized });
        console.log(`🏥 Hospital name set to "${sanitized}" by host`);
    });
}
