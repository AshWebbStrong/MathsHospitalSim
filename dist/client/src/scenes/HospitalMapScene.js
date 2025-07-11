"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalMapScene = void 0;
// src/scenes/HospitalMapScene.ts
const phaser_1 = __importDefault(require("phaser"));
const hospital_map_jpg_1 = __importDefault(require("../assets/hospital_map.jpg"));
class HospitalMapScene extends phaser_1.default.Scene {
    constructor(room) {
        super("HospitalMapScene");
        this.room = room; // store Colyseus room
    }
    preload() {
        this.load.image('map', hospital_map_jpg_1.default); // load floorplan
    }
    create() {
        this.room.send("update_location", { location: "map" }); // notify server
        this.add.image(400, 300, 'map'); // draw map
        const zones = [
            { key: 'TriageScene', x: 150, y: 200, w: 100, h: 80 },
            { key: 'TraumaBayScene', x: 350, y: 200, w: 100, h: 80 },
            { key: 'OperatingTheatreScene', x: 550, y: 200, w: 100, h: 80 },
            { key: 'MinorInjuriesUnitScene', x: 150, y: 400, w: 100, h: 80 },
            { key: 'AcuteCareBayScene', x: 350, y: 400, w: 100, h: 80 },
        ];
        zones.forEach(({ key, x, y, w, h }) => {
            const zone = this.add.zone(x, y, w, h) // create hit zone
                .setRectangleDropZone(w, h)
                .setInteractive();
            const glow = this.add // hover glow
                .rectangle(x, y, w, h, 0xffff00, 0.25)
                .setVisible(false);
            zone.on('pointerover', () => glow.setVisible(true)); // show glow
            zone.on('pointerout', () => glow.setVisible(false)); // hide glow
            zone.on('pointerdown', () => {
                console.log(`[HospitalMapScene] zone clicked → ${key}`);
                this.scene.start(key); // switch to that scene
            });
        });
    }
}
exports.HospitalMapScene = HospitalMapScene;
