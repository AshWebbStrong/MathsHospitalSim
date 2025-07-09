// rooms/schema/HospitalState.ts
import { Schema, MapSchema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
    @type("string") name: string = "";
    @type("string") location: string = "lobby";
    @type("string") id: string = ""; // Client session ID
    @type("boolean") isHost: boolean = false;
}

export class HospitalState extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type("boolean") gameStarted: boolean = false;
}
