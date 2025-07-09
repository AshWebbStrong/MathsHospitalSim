import express from 'express';
import cors from 'cors';
import { Server, matchMaker } from 'colyseus';
import http from 'http';
import { HospitalRoom } from './rooms/HospitalRoom';

const app = express();

// ✅ Enable CORS for requests from your frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // allow your React frontend
  methods: ['GET', 'POST'],
}));

app.get('/', async (req, res) => {
  try {
    const rooms = await matchMaker.query({
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
  } catch (err) {
    console.error('Failed to query rooms:', err);
    res.status(500).json({ error: 'Failed to get rooms' });
  }
});

setInterval(async () => {
  const rooms = await matchMaker.query({ name: 'hospital_room' });
  console.log('Active rooms:', rooms.map(r => r.roomId));
}, 5000);

const server = http.createServer(app);
const gameServer = new Server({ server });

gameServer.define('hospital_room', HospitalRoom);

const port = process.env.PORT || 2567;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
