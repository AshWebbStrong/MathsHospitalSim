import Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { HospitalState } from "../../../common/HospitalState";
import { createPatientActionMenu } from "../utils/createPatientActionMenu";

interface PatientSprite { container: Phaser.GameObjects.Container; id: string; }

export class MinorInjuriesUnitScene extends Phaser.Scene {
  private room!: Room<HospitalState>;
  private patientSprites: Record<string, PatientSprite> = {};
  private selectedPatientId?: string;
  private active = false;

  constructor(room: Room<HospitalState>) {
    super("MinorInjuriesUnitScene");
    this.room = room;
  }

  create() {
    console.log("[MinorInjuriesUnitScene] ⚡ create()");
    this.room.send("update_location", { location: "minor_injuries" });
    this.active = true;
    this.syncPatients();
    this.room.onStateChange(() => this.syncPatients());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      console.log("[MinorInjuriesUnitScene] 🛑 SHUTDOWN");
      this.active = false;
      Object.values(this.patientSprites).forEach(ps => ps.container.destroy(true));
      this.patientSprites = {};
      this.children.getByName("__actionMenu")?.destroy(true);
      this.room.removeAllListeners();
    });
  }

  private syncPatients() {
    if (!this.active) return;
    const patients = Array.from(this.room.state.hospital.patients.values())
      .filter(p => p.location === "minor_injuries");
    const ids = new Set(patients.map(p => p.id));

    for (const id of Object.keys(this.patientSprites)) {
      if (!ids.has(id)) {
        this.patientSprites[id].container.destroy(true);
        delete this.patientSprites[id];
      }
    }

    patients.forEach((p, i) => {
      if (this.patientSprites[p.id]) return;
      const x = 150 + (i % 4) * 120;
      const y = 100 + Math.floor(i / 4) * 120;
      const radius = 20;

      console.log(`[MinorInjuriesUnitScene] creating sprite for ${p.id} (${p.name})`);
      const gfx = this.add.graphics().fillStyle(0xaaaaff, 1).fillCircle(0, 0, radius);
      const txt = this.add.text(0, radius + 5, p.name, { fontSize: "14px", color: "#fff" })
        .setOrigin(0.5, 0);

      const container = this.add.container(x, y, [gfx, txt])
        .setSize(radius * 2, radius * 2 + 20)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.selectedPatientId = p.id;
          createPatientActionMenu(this, x + radius, y, [
            { label: "Assess", callback: () => {
                console.log("Assess clicked for", p.id);
                window.dispatchEvent(new CustomEvent("open-assessment", { detail: { patientId: p.id } }));
            }}
          ]);
        });

      this.patientSprites[p.id] = { container, id: p.id };
    });
  }
}