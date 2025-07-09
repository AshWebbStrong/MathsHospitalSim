import PhaserGame from '../components/PhaserGame';

export default function PlayerGamePage() {
  return (
    <div className="w-full h-screen">
      {/* Main Phaser game area */}
      <PhaserGame />

      {/* TODO: Add top bar, modals, mini-map overlay */}
    </div>
  );
}
