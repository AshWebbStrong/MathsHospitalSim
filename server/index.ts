import express from 'express';
import { Server } from 'colyseus';
import http from 'http';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the Hospital Math Sim backend!');
});

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

const port = process.env.PORT || 2567;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
