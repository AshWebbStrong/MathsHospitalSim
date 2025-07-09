import Phaser from 'phaser';

export class HospitalScene extends Phaser.Scene {
  constructor() {
    super('HospitalScene');
  }

  preload() {
    // Load assets here if you have any (images, sprites, etc.)
  }

  create() {
    this.add.text(100, 100, 'Hospital EsBR', { fontSize: '32px', color: '#fff' });
  }

  update(time: number, delta: number) {
    // Game loop update
  }
}
