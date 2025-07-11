// src/scenes/HospitalMapScene.ts
import Phaser from 'phaser';
import type { Room } from "colyseus.js";
import type { HospitalState } from "../../../common/HospitalState";
import hospitalMapUrl from '../assets/hospital_map.jpg';

export class HospitalMapScene extends Phaser.Scene {
  private room!: Room<HospitalState>;

  constructor(room: Room<HospitalState>) {
    super("HospitalMapScene");
    this.room = room;  // store Colyseus room
  }

  preload() {
    this.load.image('map', hospitalMapUrl);  // load floorplan
  }

  create() {
    this.room.send("update_location", { location: "map" });  // notify server
    this.add.image(400, 300, 'map');                         // draw map

    const zones = [
      { key: 'TriageScene',             x: 150, y: 200, w: 100, h: 80 },
      { key: 'TraumaBayScene',          x: 350, y: 200, w: 100, h: 80 },
      { key: 'OperatingTheatreScene',   x: 550, y: 200, w: 100, h: 80 },
      { key: 'MinorInjuriesUnitScene',  x: 150, y: 400, w: 100, h: 80 },
      { key: 'AcuteCareBayScene',       x: 350, y: 400, w: 100, h: 80 },
    ];

    zones.forEach(({ key, x, y, w, h }) => {
      const zone = this.add.zone(x, y, w, h)             // create hit zone
        .setRectangleDropZone(w, h)
        .setInteractive();

      const glow = this.add                              // hover glow
        .rectangle(x, y, w, h, 0xffff00, 0.25)
        .setVisible(false);

      zone.on('pointerover', () => glow.setVisible(true));   // show glow
      zone.on('pointerout',  () => glow.setVisible(false));  // hide glow

      zone.on('pointerdown', () => {
        console.log(`[HospitalMapScene] zone clicked → ${key}`);
        this.scene.start(key);                         // switch to that scene
      });
    });
  }
}
