// src/components/AssessmentModal.tsx
import React from "react";

interface AssessmentModalProps {
  patientId: string;
  onClose:   () => void;
}

export default function AssessmentModal({ patientId, onClose }: AssessmentModalProps) {
  return (
    // only the white box, no opaque backdrop
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="bg-white rounded-lg w-2/3 max-w-md p-6 relative pointer-events-auto shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Assess Patient {patientId.slice(0,4)}
        </h2>
        <p className="text-gray-700">[Assessment UI goes here…]</p>
      </div>
    </div>
  );
}

