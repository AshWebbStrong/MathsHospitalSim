// server/rooms/handlers/index.ts
import type { HospitalRoom }              from "../HospitalRoom";
import { registerHospitalNameHandlers }   from "./hospitalName";
import { registerGameStartHandlers }      from "./gameStart";
import { registerPatientHandlers }        from "./patient";
import { registerPlayerHandlers }        from "./player";

export function registerAllHandlers(room: HospitalRoom) {
  registerHospitalNameHandlers(room);
  registerGameStartHandlers(room);
  registerPatientHandlers(room);
  registerPlayerHandlers(room);
}
