// common/HospitalState.ts
import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";


export class HealthProblemSchema extends Schema {
  @type("string") id: string = "";             // unique identifier
  @type("string") description: string = "";    // e.g. "Fractured arm"
  // … add more fields here later …
}


export class SymptomSchema extends Schema {
  @type("string") id: string = "";           // unique identifier
  @type("string") name: string = "";         // e.g. "Headache"
  // … add more fields here later …
}



/**
 * Represents a single patient, split into:
 *  - static details: never change once created
 *  - dynamic details: can change as patient moves through hospital
 *  - arrays: healthProblems & symptoms, also mutable
 */
export class PatientSchema extends Schema {
  // ─── Static details ──────────────────────────
  @type("string") id: string     = "";        // unique patient ID
  @type("string") name: string   = "";        // e.g. "Alice Smith"
  @type("number") age: number     = 0;        // e.g. 42
  @type("string") gender: string = "";        // e.g. "female"

  // ─── Dynamic details ─────────────────────────
  @type("string") location: string = "ER";    // e.g. "waiting_room", "xray", "surgery"
  @type("boolean") alive: boolean   = true;   // true = alive, false = deceased
  @type("number") painLevel: number = 0;      // scale 0–10

  // ─── Mutable arrays ──────────────────────────
  @type([ HealthProblemSchema ])
  healthProblems = new ArraySchema<HealthProblemSchema>();  // e.g. fractures, infections

  @type([ SymptomSchema ])
  symptoms       = new ArraySchema<SymptomSchema>();       // e.g. headache, nausea
}


/**
 * The overall hospital-level schema, now holding a list of PatientSchema.
 */
export class HospitalSchema extends Schema {
  @type("string") name: string           = "My Hospital";
  @type("string") dangerCode: string     = "Green";    // add hospital danger code
  @type("number") numDoctors: number     = 0;
  @type("number") numPatients: number    = 0;
  @type("number") numDeadPatients: number= 0;
  @type("number") patientSatisfaction: number   = 100;  
  @type("number") patientGenerationInterval: number = 20000;

  // Array of patients with rich nested schemas
  @type([ PatientSchema ])
  patients = new ArraySchema<PatientSchema>();
}


export class PlayerSchema extends Schema {
  @type("string") name: string     = "";
  @type("string") location: string = "lobby";
  @type("string") id: string       = "";
  @type("boolean") isHost: boolean = false;
}


export class HospitalState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  // Embed the shared hospital object
  @type(HospitalSchema)
  hospital = new HospitalSchema();

  @type("boolean") gameStarting: boolean = false;
  @type("boolean") gameStarted:   boolean = false;
}
