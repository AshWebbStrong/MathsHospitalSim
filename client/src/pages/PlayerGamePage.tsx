// src/pages/PlayerGamePage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import PhaserGame from '../components/PhaserGame';
import Toolbar from '../components/Toolbar';
import AssessmentModal from '../components/AssessmentModal';
import TransferModal   from '../components/TransferModal';

export default function PlayerGamePage() {
  const { room } = useRoom();
  const navigate = useNavigate();

  // 1) Create a React ref for your Phaser.Game
  const gameRef = useRef<Phaser.Game | null>(null);

   // state to track which patient (if any) is being assessed
  const [assessingPatientId, setAssessingPatientId] = useState<string | null>(null);
  const [transferPatientId, setTransferPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (!room) {
      alert("You've been disconnected.");
      navigate('/');
      return
    }

    const onHostLeft = () => {
      alert("The host has left the game — returning to the home screen.");
      navigate("/");
    };
    room.onMessage('host_left', onHostLeft);

       // listen for Phaser dispatch to open assessment
    const onOpen = (e: CustomEvent) => {
      console.log("[PlayerGamePage] received open-assessment for", e.detail.patientId);
      setAssessingPatientId(e.detail.patientId);
      setTransferPatientId(e.detail.patientId);
    };
    window.addEventListener('open-assessment', onOpen as EventListener);

    return () => {
      console.log("[PlayerGamePage] unmounting or deps changing");
      window.removeEventListener('open-assessment', onOpen as EventListener);
    };

    
  }, [room, navigate]);



  // 2) Use that ref to switch scenes
  const handleMapClick = () => {
      setAssessingPatientId(null);
      const game = gameRef.current;
      if (!game) return;

      // Stop every active scene except the map
      game.scene.getScenes(true).forEach((scene) => {
        if (scene.scene.key !== 'HospitalMapScene') {
          game.scene.stop(scene.scene.key);
        }
      });

      // Then start (or restart) the map
      game.scene.start('HospitalMapScene');
    };

  return (
  <div className="w-full h-screen flex flex-col">
    <Toolbar onMapClick={handleMapClick} />

    {/* flex-1 + h-full makes this middle area fill the rest of the screen */}
    <div className="flex-1 relative h-full">
      {room ? (
        /* absolute inset-0 + w-full h-full guarantees canvas fills entire area */
        <div className="absolute inset-0 w-full h-full">
          <PhaserGame ref={gameRef} room={room} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          Connecting…
        </div>
      )}

      {/* modal still sits on top */}
      {assessingPatientId && (
        <AssessmentModal
          patientId={assessingPatientId}
          onClose={() => setAssessingPatientId(null)}
        />
      )}

        {/* transfer modal */}
        {transferPatientId && room && (
          <TransferModal
            patientId={transferPatientId}
            room={room}
            onClose={() => {
              setTransferPatientId(null);
              setAssessingPatientId(null);

            }}
          />
        )}
    </div>
  </div>
);


}
