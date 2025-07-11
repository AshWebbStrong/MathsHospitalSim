// src/pages/HostGamePage.tsx
import React, { useEffect, useState } from "react";
import { useRoom } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import {
  HospitalState,
  PatientSchema,
  HealthProblemSchema,
  SymptomSchema,
  PlayerSchema,
} from "../../../common/HospitalState";

/** Data we display for each player in the “Players” line */
interface PlayerInfo {
  sessionId: string;
  name:      string;
  location:  string;
}

/** Mirrors key HospitalSchema fields */
interface HospitalStats {
  name:               string;
  numDoctors:         number;
  numPatients:        number;
  numDeadPatients:    number;
  patientSatisfaction: number;
}

/** Flattened patient info for React state */
interface PatientInfo {
  id:             string;
  name:           string;
  location:       string;
  age:            number;
  gender:         string;
  alive:          boolean;
  painLevel:      number;
  healthProblems: HealthProblemSchema[];
  symptoms:       SymptomSchema[];
}

export default function HostGamePage() {
  const { room } = useRoom();
  const navigate = useNavigate();

  // React state
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [stats,   setStats]   = useState<HospitalStats>({
    name:             "",
    numDoctors:       0,
    numPatients:      0,
    numDeadPatients:  0,
    patientSatisfaction: 0,
  });

  const [patients,          setPatients]          = useState<PatientInfo[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (!room) {
      navigate("/");
      return;
    }

    const rebuild = () => {
      // 1) players
      const pl: PlayerInfo[] = [];
      for (const [id, p] of room.state.players.entries()) {
        pl.push({ sessionId: id, name: p.name, location: p.location });
      }
      setPlayers(pl);

      // 2) stats
      const h = room.state.hospital;
      setStats({
        name:             h.name,
        numDoctors:        h.numDoctors,
        numPatients:       h.numPatients,
        numDeadPatients:   h.numDeadPatients,
        patientSatisfaction: h.patientSatisfaction,
      });

      // 3) patients
      const pt: PatientInfo[] = room.state.hospital.patients.map((p: PatientSchema) => ({
        id:             p.id,
        name:           p.name,
        location:       p.location,
        age:            p.age,
        gender:         p.gender,
        alive:          p.alive,
        painLevel:      p.painLevel,
        healthProblems: [...p.healthProblems],
        symptoms:       [...p.symptoms],
      }));
      setPatients(pt);
    };

    rebuild();
    room.onStateChange(rebuild);
    return () => room.removeAllListeners();
  }, [room, navigate]);

  const manualGenerate = () => {
    room?.send("generate_patient");
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null;

 return (
    <div className="p-6 space-y-6">
      {/* Hospital Name */}
      <h1 className="text-3xl font-extrabold">{room?.state.hospital.name}</h1>

      {/* Hospital Stats */}
      <div className="grid grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-2xl font-semibold">{stats.numDoctors}</div>
          <div>Doctors</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{stats.numPatients}</div>
          <div>Patients</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{stats.numDeadPatients}</div>
          <div>Dead</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{stats.patientSatisfaction}%</div>
          <div>Satisfaction</div>
        </div>
      </div>

      {/* Players line */}
      <div className="text-sm text-gray-700">
        <strong>Players:</strong>{" "}
        {players.map((p, i) => (
          <span key={p.sessionId}>
            {p.name} (@{p.location})
            {i < players.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="flex h-[60vh]">
        {/* Left: Patient list */}
        <div className="w-1/3 border rounded p-4 overflow-auto">
          <h2 className="font-semibold mb-2">Patients</h2>
          <ul>
            {patients.map((p) => (
              <li
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`cursor-pointer py-1 px-2 rounded ${
                  p.id === selectedPatientId ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                {p.name}
              </li>
            ))}
          </ul>
          <button
            onClick={manualGenerate}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded"
          >
            + Generate Patient
          </button>
        </div>

        {/* Right: Patient details */}
        <div className="flex-1 border rounded p-4 ml-6 overflow-auto">
          {selectedPatient ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {selectedPatient.name}
              </h2>
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="pr-4 py-1">ID</th>
                    <td>{selectedPatient.id}</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1">Age</th>
                    <td>{selectedPatient.age}</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1">Gender</th>
                    <td>{selectedPatient.gender}</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1">Location</th>
                    <td>{selectedPatient.location}</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1">Pain Level</th>
                    <td>{selectedPatient.painLevel}/10</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1">Alive?</th>
                    <td>{selectedPatient.alive ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1 align-top">Problems</th>
                    <td>
                      {selectedPatient.healthProblems.length > 0
                        ? selectedPatient.healthProblems
                            .map((hp) => hp.description)
                            .join(", ")
                        : "None"}
                    </td>
                  </tr>
                  <tr>
                    <th className="pr-4 py-1 align-top">Symptoms</th>
                    <td>
                      {selectedPatient.symptoms.length > 0
                        ? selectedPatient.symptoms.map((s) => s.name).join(", ")
                        : "None"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <div className="text-gray-500 italic">
              Select a patient from the list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

