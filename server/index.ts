import express from 'express';
import { Server } from 'colyseus';
import http from 'http';

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello from Hospital Math Sim!');
});

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

const port = process.env.PORT || 2567;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
