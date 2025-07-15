/* common/definitions/treatments.ts */

// Machine-friendly treatment identifiers
export const TREATMENT_IDS = {
  ADMINISTER_MEDICATION:       "administer_medication",
  CLOSE_WOUND:                 "close_wound",
  IMMOBILISE_FRACTURE_SPR:     "immobilise_fracture_spr",
  REDUCE_DISLOCATION:          "reduce_dislocation",
  PREPARE_FOR_SURGERY:         "prepare_for_surgery",
  DRAIN_ABSCESS:               "drain_abscess",
  START_IV_ANTIBIOTICS:        "start_iv_antibiotics",
  TRANSFUSE_BLOOD:             "transfuse_blood",
  PROVIDE_RESPIRATORY_THERAPY: "provide_respiratory_therapy",
} as const;

export type TreatmentId = keyof typeof TREATMENT_IDS;

export interface TreatmentAction {
  id:          string;   // e.g. "administer_medication"
  label:       string;   // human-friendly
  equipment:   string;
  consequence: string;   // will later change to consequenceId
}

// Now key by the SAME UPPER_SNAKE as TREATMENT_IDS so TREATMENTS.CLOSE_WOUND works
export const TREATMENTS: {
  [K in TreatmentId]: TreatmentAction
} = {
  ADMINISTER_MEDICATION: {
    id:          TREATMENT_IDS.ADMINISTER_MEDICATION,
    label:       "Administer medication",
    equipment:   "Drug cart + IV/IM/oral supplies",
    consequence: "Adverse drug reaction",
  },
  CLOSE_WOUND: {
    id:          TREATMENT_IDS.CLOSE_WOUND,
    label:       "Close wound (suture / glue)",
    equipment:   "Suture kit / skin-glue / stapler",
    consequence: "Wound infection",
  },
  IMMOBILISE_FRACTURE_SPR: {
    id:          TREATMENT_IDS.IMMOBILISE_FRACTURE_SPR,
    label:       "Immobilise fracture / sprain",
    equipment:   "Splint or cast materials",
    consequence: "Compartment syndrome",
  },
  REDUCE_DISLOCATION: {
    id:          TREATMENT_IDS.REDUCE_DISLOCATION,
    label:       "Reduce dislocation / fracture",
    equipment:   "Sedation meds + reduction tools",
    consequence: "Persistent deformity",
  },
  PREPARE_FOR_SURGERY: {
    id:          TREATMENT_IDS.PREPARE_FOR_SURGERY,
    label:       "Prepare for surgery (send to OR)",
    equipment:   "Operating theatre slot + consent",
    consequence: "Surgical-delay complications",
  },
  DRAIN_ABSCESS: {
    id:          TREATMENT_IDS.DRAIN_ABSCESS,
    label:       "Drain abscess / fluid build-up",
    equipment:   "Sterile drainage kit (scalpel, syringe)",
    consequence: "Sepsis spread",
  },
  START_IV_ANTIBIOTICS: {
    id:          TREATMENT_IDS.START_IV_ANTIBIOTICS,
    label:       "Start IV antibiotics / fluids",
    equipment:   "IV line, pump, antibiotic or saline bags",
    consequence: "Hypovolaemic shock",
  },
  TRANSFUSE_BLOOD: {
    id:          TREATMENT_IDS.TRANSFUSE_BLOOD,
    label:       "Transfuse blood",
    equipment:   "Cross-matched blood units + transfusion set",
    consequence: "Transfusion reaction",
  },
  PROVIDE_RESPIRATORY_THERAPY: {
    id:          TREATMENT_IDS.PROVIDE_RESPIRATORY_THERAPY,
    label:       "Provide respiratory therapy (nebuliser / inhaler)",
    equipment:   "Nebuliser mask or metered-dose inhaler",
    consequence: "Respiratory failure",
  },
};


// Optional array for ordered iteration (e.g., UI dropdown)
export const TREATMENT_LIST: TreatmentAction[] = Object.values(TREATMENTS);
