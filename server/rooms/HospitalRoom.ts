import { Room, Client } from 'colyseus';
import { HospitalState, PlayerSchema } from './schema/HospitalState'; // 👈 Import

export class HospitalRoom extends Room<HospitalState> {
     hostClientId: string | null = null;

    onCreate( options: any) {
        console.log("🛠 Room creation options:", options); 
        const roomCode = options.roomCode || this.roomId;

        this.setMetadata({ roomCode }); // ✅ must be set early and directly
        this.state = new HospitalState();

        console.log(`✅ HospitalRoom created with roomCode: ${roomCode}`);
    }

    onJoin(client: Client, options: any) {
    const name = options.name || 'Anonymous';

    const newPlayer = new PlayerSchema();
    newPlayer.name = name;
    newPlayer.location = "lobby";
    newPlayer.isHost = options.role === 'host';
    newPlayer.id = client.sessionId;

    this.state.players.set(client.sessionId, newPlayer);

    if (newPlayer.isHost) {
        this.hostClientId = client.sessionId;

        // ✅ Send roomCode manually to host
        client.send('room_code', { roomCode: options.roomCode });
        console.log('📨 Sent room_code message to host:', options.roomCode);
    }

    console.log(`👤 ${name} joined as ${newPlayer.isHost ? 'host' : 'player'}`);
    }


    onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);

    if (player?.isHost) {
        // Notify all clients
        this.broadcast("host_left", { reason: "Host left or closed the room." });

        // Dispose the room entirely
        this.disconnect(); // will call `onDispose` below
    } else {
        // Just remove the player
        this.state.players.delete(client.sessionId);
    }
    }

  onDispose() {
    console.log('🗑️ HospitalRoom disposed');
  }
}
