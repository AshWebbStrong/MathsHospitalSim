"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinHospitalRoom = exports.findRoomIdByCode = void 0;
const Colyseus = __importStar(require("colyseus.js"));
const client = new Colyseus.Client('ws://localhost:2567'); // replace with env for prod
// Looks up the internal roomId from the custom roomCode (5-letter code)
const findRoomIdByCode = (roomCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch('http://localhost:2567'); // same as your Express GET /
        const rooms = yield res.json();
        const found = rooms.find((room) => { var _a; return ((_a = room.metadata) === null || _a === void 0 ? void 0 : _a.roomCode) === roomCode.toUpperCase(); });
        return found ? found.roomId : null;
    }
    catch (err) {
        console.error('❌ Failed to fetch room list:', err);
        return null;
    }
});
exports.findRoomIdByCode = findRoomIdByCode;
// Joins the room by internal ID, after you've already resolved it via findRoomIdByCode
const joinHospitalRoom = (playerName_1, roomId_1, ...args_1) => __awaiter(void 0, [playerName_1, roomId_1, ...args_1], void 0, function* (playerName, roomId, role = 'player', roomCode, // ✅ Add roomCode only for host
maxPlayers = 4) {
    try {
        const room = roomId
            ? yield client.joinById(roomId, {
                name: playerName,
                role
            })
            : yield client.create('hospital_room', {
                name: playerName,
                role,
                roomCode,
                maxPlayers // ✅ Include maxPlayers when creating the room
            });
        return { room };
    }
    catch (e) {
        console.error('Join failed:', e);
        throw e;
    }
});
exports.joinHospitalRoom = joinHospitalRoom;
