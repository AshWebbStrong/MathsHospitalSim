"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalRoom = void 0;
// HospitalRoom.ts
const colyseus_1 = require("colyseus");
console.log("HospitalRoom class loaded");
class HospitalRoom extends colyseus_1.Room {
    onCreate(options) {
        console.log('✅ HospitalRoom created');
    }
    onJoin(client, options) {
        console.log(`👤 ${client.sessionId} joined the room`);
    }
    onLeave(client, consented) {
        console.log(`👤 ${client.sessionId} left the room`);
    }
    onDispose() {
        console.log('🗑️ HospitalRoom disposed');
    }
}
exports.HospitalRoom = HospitalRoom;
