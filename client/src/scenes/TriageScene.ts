// src/scenes/TriageScene.ts
import Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { HospitalState } from "../../../common/HospitalState";
import { createPatientActionMenu } from "../utils/createPatientActionMenu";

interface PatientSprite { container: Phaser.GameObjects.Container; id: string; }

export class TriageScene extends Phaser.Scene {
  private room!: Room<HospitalState>;
  private patientSprites: Record<string, PatientSprite> = {};
  private selectedPatientId?: string;
  private active = false;  // track if scene is active

  constructor(room: Room<HospitalState>) {
    super("TriageScene");
    this.room = room;  // store the Colyseus room
  }

  create() {
    console.log("[TriageScene] ⚡ create()");
    this.room.send("update_location", { location: "triage" });  // notify server
    this.active = true;  
    this.syncPatients();                                        // initial render
    this.room.onStateChange(() => this.syncPatients());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      console.log("[TriageScene] 🛑 SHUTDOWN");
      this.active = false;   // mark inactive
      // destroy all patient sprites
      Object.values(this.patientSprites).forEach(ps => ps.container.destroy(true));
      this.patientSprites = {};
      // clear any lingering menus
      this.children.getByName("__actionMenu")?.destroy(true);
      // remove all room listeners
      this.room.removeAllListeners();
    });
  }

  private syncPatients() {
    if (!this.active) return;   // skip if scene is gone

    // gather current triage patients
    const patients = Array.from(this.room.state.hospital.patients.values())
      .filter(p => p.location === "triage");
    const ids = new Set(patients.map(p => p.id));

    // remove sprites for departed patients
    for (const id of Object.keys(this.patientSprites)) {
      if (!ids.has(id)) {
        this.patientSprites[id].container.destroy(true);
        delete this.patientSprites[id];
      }
    }

    // add sprites for new patients
    patients.forEach((p, i) => {
      if (this.patientSprites[p.id]) return;
      const x = 150 + (i % 4) * 120, y = 100 + Math.floor(i / 4) * 120;
      const radius = 20;

      const gfx = this.add.graphics().fillStyle(0x00aaff, 1).fillCircle(0, 0, radius);
      const txt = this.add.text(0, radius + 5, p.name, { fontSize: "14px", color: "#fff" })
        .setOrigin(0.5, 0);

      const container = this.add.container(x, y, [gfx, txt])
        .setSize(radius * 2, radius * 2 + 20)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.selectedPatientId = p.id;   // store it on the scene
          createPatientActionMenu(this, x + radius, y, [
            { label: "Assess", callback: () => {
                console.log("Assess clicked for", p.id);
                window.dispatchEvent(new CustomEvent("open-assessment", {
                  detail: { patientId: p.id }
                }));
            }}
          ]);
        });
      this.patientSprites[p.id] = { container, id: p.id };
    });
  }
}
