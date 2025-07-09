import { Schema } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  id: string = "";
  name: string = "";
  location: string = "lobby";
  isHost: boolean = false;
}