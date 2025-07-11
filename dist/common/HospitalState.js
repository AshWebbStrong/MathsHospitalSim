"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalState = exports.PlayerSchema = exports.HospitalSchema = exports.PatientSchema = exports.SymptomSchema = exports.HealthProblemSchema = void 0;
// common/HospitalState.ts
const schema_1 = require("@colyseus/schema");
class HealthProblemSchema extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.id = ""; // unique identifier
        this.description = ""; // e.g. "Fractured arm"
        // … add more fields here later …
    }
}
exports.HealthProblemSchema = HealthProblemSchema;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], HealthProblemSchema.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], HealthProblemSchema.prototype, "description", void 0);
class SymptomSchema extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.id = ""; // unique identifier
        this.name = ""; // e.g. "Headache"
        // … add more fields here later …
    }
}
exports.SymptomSchema = SymptomSchema;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], SymptomSchema.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], SymptomSchema.prototype, "name", void 0);
/**
 * Represents a single patient, split into:
 *  - static details: never change once created
 *  - dynamic details: can change as patient moves through hospital
 *  - arrays: healthProblems & symptoms, also mutable
 */
class PatientSchema extends schema_1.Schema {
    constructor() {
        super(...arguments);
        // ─── Static details ──────────────────────────
        this.id = ""; // unique patient ID
        this.name = ""; // e.g. "Alice Smith"
        this.age = 0; // e.g. 42
        this.gender = ""; // e.g. "female"
        // ─── Dynamic details ─────────────────────────
        this.location = "ER"; // e.g. "waiting_room", "xray", "surgery"
        this.alive = true; // true = alive, false = deceased
        this.painLevel = 0; // scale 0–10
        // ─── Mutable arrays ──────────────────────────
        this.healthProblems = new schema_1.ArraySchema(); // e.g. fractures, infections
        this.symptoms = new schema_1.ArraySchema(); // e.g. headache, nausea
    }
}
exports.PatientSchema = PatientSchema;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PatientSchema.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PatientSchema.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], PatientSchema.prototype, "age", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PatientSchema.prototype, "gender", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PatientSchema.prototype, "location", void 0);
__decorate([
    (0, schema_1.type)("boolean"),
    __metadata("design:type", Boolean)
], PatientSchema.prototype, "alive", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], PatientSchema.prototype, "painLevel", void 0);
__decorate([
    (0, schema_1.type)([HealthProblemSchema]),
    __metadata("design:type", Object)
], PatientSchema.prototype, "healthProblems", void 0);
__decorate([
    (0, schema_1.type)([SymptomSchema]),
    __metadata("design:type", Object)
], PatientSchema.prototype, "symptoms", void 0);
/**
 * The overall hospital-level schema, now holding a list of PatientSchema.
 */
class HospitalSchema extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.name = "My Hospital";
        this.dangerCode = "Green"; // add hospital danger code
        this.numDoctors = 0;
        this.numPatients = 0;
        this.numDeadPatients = 0;
        this.patientSatisfaction = 100;
        this.patientGenerationInterval = 20000;
        // Array of patients with rich nested schemas
        this.patients = new schema_1.ArraySchema();
    }
}
exports.HospitalSchema = HospitalSchema;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], HospitalSchema.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], HospitalSchema.prototype, "dangerCode", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], HospitalSchema.prototype, "numDoctors", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], HospitalSchema.prototype, "numPatients", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], HospitalSchema.prototype, "numDeadPatients", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], HospitalSchema.prototype, "patientSatisfaction", void 0);
__decorate([
    (0, schema_1.type)("number"),
    __metadata("design:type", Number)
], HospitalSchema.prototype, "patientGenerationInterval", void 0);
__decorate([
    (0, schema_1.type)([PatientSchema]),
    __metadata("design:type", Object)
], HospitalSchema.prototype, "patients", void 0);
class PlayerSchema extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.name = "";
        this.location = "lobby";
        this.id = "";
        this.isHost = false;
    }
}
exports.PlayerSchema = PlayerSchema;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PlayerSchema.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PlayerSchema.prototype, "location", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], PlayerSchema.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("boolean"),
    __metadata("design:type", Boolean)
], PlayerSchema.prototype, "isHost", void 0);
class HospitalState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        // Embed the shared hospital object
        this.hospital = new HospitalSchema();
        this.gameStarting = false;
        this.gameStarted = false;
    }
}
exports.HospitalState = HospitalState;
__decorate([
    (0, schema_1.type)({ map: PlayerSchema }),
    __metadata("design:type", Object)
], HospitalState.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)(HospitalSchema),
    __metadata("design:type", Object)
], HospitalState.prototype, "hospital", void 0);
__decorate([
    (0, schema_1.type)("boolean"),
    __metadata("design:type", Boolean)
], HospitalState.prototype, "gameStarting", void 0);
__decorate([
    (0, schema_1.type)("boolean"),
    __metadata("design:type", Boolean)
], HospitalState.prototype, "gameStarted", void 0);
