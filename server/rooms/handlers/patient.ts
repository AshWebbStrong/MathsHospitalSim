// server/rooms/handlers/patient.ts
import { v4 as uuidv4 } from "uuid";
import type { HospitalRoom }  from "../HospitalRoom";
import { PatientSchema } from "../../../common/HospitalState";

export function registerPatientHandlers(room: HospitalRoom) {
  // Helper: actually instantiate & inject a new patient
  const generatePatient = () => {
    const p = new PatientSchema();
    p.id     = uuidv4();
    p.name   = `Patient ${p.id.slice(0,4)}`;       // placeholder
    p.age    = Math.floor(Math.random() * 60) + 20;
    p.gender = Math.random() < 0.5 ? "male" : "female";

    // push into the shared array & bump the count
    room.state.hospital.patients.push(p);
    room.state.hospital.numPatients++;
    console.log(`➕ New patient generated: ${p.name}`);
  };

  // 1) Manual trigger: host clicks “Generate Patient”
  room.onMessage("generate_patient", (client) => {
    const player = room.state.players.get(client.sessionId);
    if (!player?.isHost) return;  // only host may
    generatePatient();
  });

  // 2) Automatic generation on an interval
  const intervalKey = Symbol("patientInterval");

  const startAutoGen = (intervalMs: number) => {
    // clear any existing
    const prev = (room as any)[intervalKey];
    if (prev) clearInterval(prev);

    // set new
    (room as any)[intervalKey] = setInterval(generatePatient, intervalMs);
    console.log(`⏱️ Auto-patient generation every ${intervalMs}ms`);
  };

  // a) allow host to update the interval dynamically
  room.onMessage("set_patient_interval", (client, { interval }: { interval: number }) => {
    const player = room.state.players.get(client.sessionId);
    if (!player?.isHost) return;

    // sanitize / enforce a minimum if you like:
    const ms = Math.max(1000, interval);
    room.state.hospital.patientGenerationInterval = ms;
    startAutoGen(ms);
  });

  // Start the automatic loop using the default interval in state
  startAutoGen(room.state.hospital.patientGenerationInterval);

  // 3) Cleanup the interval on room dispose
  const originalOnDispose = room.onDispose.bind(room);
  room.onDispose = () => {
    const tid = (room as any)[intervalKey];
    if (tid) clearInterval(tid);
    originalOnDispose();
  };
}
