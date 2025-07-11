"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const colyseus_1 = require("colyseus");
const http_1 = __importDefault(require("http"));
const HospitalRoom_1 = require("./rooms/HospitalRoom");
const app = (0, express_1.default)();
// ✅ Enable CORS for requests from your frontend origin
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // allow your React frontend
    methods: ['GET', 'POST'],
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield colyseus_1.matchMaker.query({
            name: 'hospital_room',
        });
        const roomInfo = rooms.map(room => ({
            roomId: room.roomId,
            clients: room.clients,
            maxClients: room.maxClients,
            metadata: room.metadata,
            createdAt: room.createdAt,
        }));
        res.json(roomInfo);
    }
    catch (err) {
        console.error('Failed to query rooms:', err);
        res.status(500).json({ error: 'Failed to get rooms' });
    }
}));
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield colyseus_1.matchMaker.query({ name: 'hospital_room' });
    console.log('Active rooms:', rooms.map(r => r.roomId));
}), 5000);
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({ server });
gameServer.define('hospital_room', HospitalRoom_1.HospitalRoom);
const port = process.env.PORT || 2567;
server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
