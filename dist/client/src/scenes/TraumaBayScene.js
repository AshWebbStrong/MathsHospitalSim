"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraumaBayScene = void 0;
// src/scenes/TraumaBayScene.ts
const phaser_1 = __importDefault(require("phaser"));
const createPatientActionMenu_1 = require("../utils/createPatientActionMenu");
class TraumaBayScene extends phaser_1.default.Scene {
    constructor(room) {
        super("TraumaBayScene");
        this.patientSprites = {};
        this.active = false;
        this.room = room;
    }
    create() {
        console.log("[TraumaBayScene] ⚡ create()");
        this.room.send("update_location", { location: "trauma" });
        this.active = true;
        this.syncPatients();
        this.room.onStateChange(() => this.syncPatients());
        this.events.once(phaser_1.default.Scenes.Events.SHUTDOWN, () => {
            var _a;
            console.log("[TraumaBayScene] 🛑 SHUTDOWN");
            this.active = false;
            Object.values(this.patientSprites).forEach(ps => ps.container.destroy(true));
            this.patientSprites = {};
            (_a = this.children.getByName("__actionMenu")) === null || _a === void 0 ? void 0 : _a.destroy(true);
            this.room.removeAllListeners();
        });
    }
    syncPatients() {
        if (!this.active)
            return;
        const patients = Array.from(this.room.state.hospital.patients.values())
            .filter(p => p.location === "trauma");
        const ids = new Set(patients.map(p => p.id));
        for (const id of Object.keys(this.patientSprites)) {
            if (!ids.has(id)) {
                this.patientSprites[id].container.destroy(true);
                delete this.patientSprites[id];
            }
        }
        patients.forEach((p, i) => {
            if (this.patientSprites[p.id])
                return;
            const x = 150 + (i % 4) * 120;
            const y = 100 + Math.floor(i / 4) * 120;
            const radius = 20;
            console.log(`[TraumaBayScene] creating sprite for ${p.id} (${p.name})`);
            const gfx = this.add.graphics().fillStyle(0xff4444, 1).fillCircle(0, 0, radius);
            const txt = this.add.text(0, radius + 5, p.name, { fontSize: "14px", color: "#fff" })
                .setOrigin(0.5, 0);
            const container = this.add.container(x, y, [gfx, txt])
                .setSize(radius * 2, radius * 2 + 20)
                .setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                this.selectedPatientId = p.id;
                (0, createPatientActionMenu_1.createPatientActionMenu)(this, x + radius, y, [
                    { label: "Assess", callback: () => {
                            console.log("Assess clicked for", p.id);
                            window.dispatchEvent(new CustomEvent("open-assessment", { detail: { patientId: p.id } }));
                        } }
                ]);
            });
            this.patientSprites[p.id] = { container, id: p.id };
        });
    }
}
exports.TraumaBayScene = TraumaBayScene;
