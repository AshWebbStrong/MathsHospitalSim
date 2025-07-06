"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colyseus_1 = require("colyseus");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({
    server,
});
const port = 2567;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
