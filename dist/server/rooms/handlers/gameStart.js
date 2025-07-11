"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameStartHandlers = registerGameStartHandlers;
function registerGameStartHandlers(room) {
    room.onMessage("start_game", (client) => {
        const player = room.state.players.get(client.sessionId);
        if (!(player === null || player === void 0 ? void 0 : player.isHost) || room.state.gameStarted) {
            return;
        }
        console.log("🕒 Host initiated game start; beginning 3s countdown...");
        room.state.gameStarting = true;
        setTimeout(() => {
            // ── initialize stats ─────────────────────
            room.state.hospital.numDoctors = Array
                .from(room.state.players.values())
                .filter(p => !p.isHost).length;
            room.state.hospital.numPatients = 0;
            room.state.hospital.numDeadPatients = 0;
            room.state.hospital.patientSatisfaction = 100;
            // ── officially start ─────────────────────
            room.state.gameStarted = true;
            console.log("🎮 Game officially started — hospital stats initialized");
            // ── start your engine ────────────────────
            room.engine.start();
            // 2) define a named recursive scheduler
            const scheduleNextPatient = () => {
                room.generatePatient();
                // store the new ID so we can cancel it later
                room._nextPatientEventId = room.engine.schedule(room.state.hospital.patientGenerationInterval, scheduleNextPatient);
            };
            // 3) schedule the very first run and store its ID
            room._nextPatientEventId = room.engine.schedule(room.state.hospital.patientGenerationInterval, scheduleNextPatient);
        }, 3000);
    });
}
