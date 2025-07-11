// src/components/TransferModal.tsx
import React from "react";

interface TransferModalProps {
  patientId: string;
  room:      import("colyseus.js").Room<any>;
  onClose:   () => void;
}

const TARGET_ROOMS = [
  { label: "Minor Injuries",    location: "minor_injuries" },
  { label: "Acute Care Bay",    location: "acute_care"     },
  { label: "Trauma Bay",        location: "trauma"        },
  { label: "Operating Theatre", location: "operating_theatre" },
];

export default function TransferModal({ patientId, room, onClose }: TransferModalProps) {
  const transfer = (loc: string) => {
    console.log(`Transferring ${patientId} → ${loc}`);
    room.send("transfer_patient", { patientId, location: loc });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-100 z-40">
      <div className="bg-white rounded-lg w-2/3 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h3 className="text-lg font-medium mb-4">
          Transfer Patient {patientId.slice(0,4)}
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {TARGET_ROOMS.map(({ label, location }) => (
            <button
              key={location}
              onClick={() => transfer(location)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
