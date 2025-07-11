// src/utils/createActionMenu.ts
import Phaser from "phaser";

export interface ActionItem {
  label: string;
  callback: () => void;
}

export function createPatientActionMenu(
  scene: Phaser.Scene,
  x: number,
  y: number,
  items: ActionItem[]
): Phaser.GameObjects.Container {
  // destroy any existing menu on the scene
  scene.children.getByName("__actionMenu")?.destroy(true);

  const padding   = 8;
  const btnHeight = 24;
  const width     = 100;
  const height    = padding * 2 + items.length * btnHeight + (items.length - 1) * padding;

  // background panel
  const bg = scene.add.graphics();
  bg.fillStyle(0x333333, 0.9)
    .fillRoundedRect(0, 0, width, height, 6);

  // buttons
  const texts = items.map((item, idx) => {
    const ty = padding + idx * (btnHeight + padding);
    const txt = scene.add
      .text(width / 2, ty + btnHeight / 2, item.label, {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        item.callback();
        // optionally destroy menu after click:
        container.destroy(true);
      });
    return txt;
  });

  // put it all in a container
  const container = scene.add
    .container(x, y, [bg, ...texts])
    .setSize(width, height)
    .setDepth(1000)
    .setName("__actionMenu");

  return container;
}
