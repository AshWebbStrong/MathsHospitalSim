import React, { useEffect, useRef, forwardRef } from "react";
import Phaser from "phaser";
import type { Room } from "colyseus.js";
import type { HospitalState } from "../../../common/HospitalState";
import { HospitalMapScene } from "../scenes/HospitalMapScene";
import { TriageScene } from "../scenes/TriageScene";
import { TraumaBayScene } from "../scenes/TraumaBayScene";
import { AcuteCareBayScene } from "../scenes/AcuteCareBayScene";
import { MinorInjuriesUnitScene } from "../scenes/MinorInjuriesUnitScene";
import { OperatingTheatreScene } from "../scenes/OperatingTheatreScene";

interface PhaserGameProps {
  room: Room<HospitalState>;
}

// forwardRef<InstanceType, PropsType>
const PhaserGame = forwardRef<Phaser.Game | null, PhaserGameProps>(
  ({ room }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
      if (!room || !divRef.current || gameRef.current) return;

      console.log("[PhaserGame] Instantiating scenes with room:", room);
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: divRef.current,
        },
        backgroundColor: "#222",
        scene: [
          new HospitalMapScene(room),
          new TriageScene(room),
          new TraumaBayScene(room),
          new AcuteCareBayScene(room),
          new MinorInjuriesUnitScene(room),
          new OperatingTheatreScene(room),
        ],
      });

      gameRef.current = game;

      // assign to parent ref
      if (typeof ref === "function") {
        ref(game);
      } else if (ref && typeof ref !== 'function') {
        (ref as React.RefObject<Phaser.Game | null>).current = game;
      }

      return () => {
        game.destroy(true);
        gameRef.current = null;

        if (typeof ref === "function") {
          ref(null);
        } else if (ref && typeof ref !== 'function') {
          (ref as React.RefObject<Phaser.Game | null>).current = null;
        }
      };
    }, [room, ref]);

    return <div ref={divRef} className="w-full h-full" />;
  }
);

export default PhaserGame;
