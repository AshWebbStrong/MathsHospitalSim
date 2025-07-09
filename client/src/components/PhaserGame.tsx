import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { HospitalScene } from '../scenes/HospitalScene';

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: divRef.current,
        scene: [HospitalScene],
        backgroundColor: '#222',
      });
    }

    // Cleanup on unmount
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={divRef} />;
};

export default PhaserGame;
