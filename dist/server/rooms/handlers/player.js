"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPlayerHandlers = registerPlayerHandlers;
function registerPlayerHandlers(room) {
    // allow any client to update its own location
    room.onMessage("update_location", (client, payload) => {
        const player = room.state.players.get(client.sessionId);
        if (!player)
            return;
        player.location = payload.location;
        // (optionally) you could validate location against an allowed list,
        // or broadcast something special here.
    });
}
