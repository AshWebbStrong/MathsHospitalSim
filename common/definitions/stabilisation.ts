/* common/definitions/stabalisation.ts */

export interface StabilisationStep {
  /** machine-friendly identifier */
  id: string;              
  /** human-friendly label for display */
  label: string;
  urgency: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  consequence: string;
}

export const STABILISATION_STEPS: Record<string, StabilisationStep> = {
  DEFIBRILLATION: {
    id:       "DEFIBRILLATION",
    label:    "Defibrillation",
    urgency:  10,
    consequence: "Cardiac arrest - death"
  },
  OPEN_AIRWAY: {
    id:       "OPEN_AIRWAY",
    label:    "Open the airway",
    urgency:  10,
    consequence: "Respiratory arrest - death"
  },
  STOP_BLEEDING: {
    id:       "STOP_BLEEDING",
    label:    "Stop the bleeding",
    urgency:  10,
    consequence: "Hemorrhagic shock"
  },
  NEEDLE_CHEST_DECOMPRESSION: {
    id:       "NEEDLE_CHEST_DECOMPRESSION",
    label:    "Needle chest decompression",
    urgency:  9,
    consequence: "Tension pneumothorax"
  },
  EPINEPHRINE_SHOT: {
    id:       "EPINEPHRINE_SHOT",
    label:    "Epinephrine shot",
    urgency:  9,
    consequence: "Anaphylactic shock"
  },
  NALOXONE: {
    id:       "NALOXONE",
    label:    "Naloxone",
    urgency:  9,
    consequence: "Respiratory arrest - death"
  },
  GIVE_GLUCOSE: {
    id:       "GIVE_GLUCOSE",
    label:    "Give glucose",
    urgency:  8,
    consequence: "Hypoglycaemic coma"
  },
  STOP_A_SEIZURE: {
    id:       "STOP_A_SEIZURE",
    label:    "Stop a seizure",
    urgency:  8,
    consequence: "Status epilepticus"
  },
  GIVE_OXYGEN: {
    id:       "GIVE_OXYGEN",
    label:    "Give oxygen",
    urgency:  7,
    consequence: "Severe hypoxia"
  },
  START_IV_FLUIDS: {
    id:       "START_IV_FLUIDS",
    label:    "Start IV fluids",
    urgency:  6,
    consequence: "Hypovolaemic shock"
  },
  RAPID_COOL_WARM: {
    id:       "RAPID_COOL_WARM",
    label:    "Rapid cooling or warming",
    urgency:  5,
    consequence: "Heat stroke / Hypothermia"
  }
}
