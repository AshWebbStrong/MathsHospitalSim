"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colyseus_1 = require("colyseus");
const http_1 = __importDefault(require("http"));
const HospitalRoom_1 = require("./rooms/HospitalRoom");
const app = (0, express_1.default)();
console.log("HospitalRoom imported:", HospitalRoom_1.HospitalRoom);
app.get('/', (req, res) => {
    res.send('Hello from Hospital Math Sim!');
});
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({ server });
// 💥 This line registers the room so clients can join it
gameServer.define('hospital_room', HospitalRoom_1.HospitalRoom);
const port = process.env.PORT || 2567;
server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
