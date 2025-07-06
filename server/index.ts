import express from 'express';
import { Server } from 'colyseus';
import http from 'http';

const app = express();
const server = http.createServer(app);
const gameServer = new Server({
  server,
});

const port = 2567;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
