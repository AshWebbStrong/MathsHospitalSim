/* common/definitions/conditions.ts */

import { SYMPTOMS } from "./symptoms";
import { STABILISATION_STEPS } from "./stabilisation";
import { DIAGNOSIS_TOOLS } from "./diagnosis";
import { TREATMENTS } from "./treatments";

export const CONDITION_IDS = {
    // Treatment fail conditions
    ADVERSE_DRUG_REACTION:   "adverse_drug_reaction",
    WOUND_INFECTION:         "wound_infection",
    COMPARTMENT_SYNDROME:    "compartment_syndrome",
    PERSISTENT_DEFORMITY:    "persistent_deformity",
    SEPSIS_SPREAD:           "sepsis_spread",
    HYPOVOLOAEMIC_SHOCK:     "hypovolaemic_shock",
    TRANSFUSION_REACTION:    "transfusion_reaction",
    RESPIRATORY_FAILURE:     "respiratory_failure",

    //Stabilisation fail conditions
    HEMORRHAGIC_SHOCK:        "hemorrhagic_shock",
    TENSION_PNEUMOTHORAX:     "tension_pneumothorax",
    ANAPHYLACTIC_SHOCK:       "anaphylactic_shock",
    HYPOGLYCAEMIC_COMA:       "hypoglycaemic_coma",
    STATUS_EPILEPTICUS:       "status_epilepticus",
    SEVERE_HYPOXIA:           "severe_hypoxia",
    HEAT_STROKE_HYPOTHERMIA:  "heat_stroke_hypothermia",
} as const;

export type ConditionId = typeof CONDITION_IDS[keyof typeof CONDITION_IDS];

export interface Condition {
  id: ConditionId;
  label: string;
  description: string;
  symptoms: typeof SYMPTOMS[keyof typeof SYMPTOMS][];    // up to 3
  stabilisation?: typeof STABILISATION_STEPS[keyof typeof STABILISATION_STEPS];
  stabilisationTime: number | null;                     // hours (1–12 in .25 steps) or null
  diagnosis: typeof DIAGNOSIS_TOOLS[keyof typeof DIAGNOSIS_TOOLS][];  // up to 2
  treatment: typeof TREATMENTS[keyof typeof TREATMENTS][];           // up to 2
  treatmentTime: number | null;                         // hours (1–12 in .25 steps) or null
}

export const CONDITIONS: Record<ConditionId, Condition> = {
  [CONDITION_IDS.ADVERSE_DRUG_REACTION]: {
    id: CONDITION_IDS.ADVERSE_DRUG_REACTION,
    label: "Adverse drug reaction",
    description:
      "Unexpected immunologic or toxic response to medication, ranging from rash and fever to anaphylaxis.",
    symptoms: [
      SYMPTOMS.RASH,
      SYMPTOMS.HIGH_FEVER,
      SYMPTOMS.CONFUSION
    ],
    stabilisation: STABILISATION_STEPS.EPINEPHRINE_SHOT,
    stabilisationTime: 1,   // must give epinephrine within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_TEST,
      DIAGNOSIS_TOOLS.ALLERGY_TEST
    ],
    treatment: [
      TREATMENTS.ADMINISTER_MEDICATION
    ],
    treatmentTime: 2        // follow up med within 2 h
  },

  [CONDITION_IDS.WOUND_INFECTION]: {
    id: CONDITION_IDS.WOUND_INFECTION,
    label: "Wound infection",
    description:
      "Bacterial contamination of a recent wound, producing local inflammation and systemic symptoms if unchecked.",
    symptoms: [
      SYMPTOMS.SWELLING,
      SYMPTOMS.RASH,
      SYMPTOMS.MILD_FEVER
    ],
    stabilisation: STABILISATION_STEPS.START_IV_FLUIDS,
    stabilisationTime: 2,   // restore volume within 2 h
    diagnosis: [
      DIAGNOSIS_TOOLS.PHYSICAL_EXAM,
      DIAGNOSIS_TOOLS.BLOOD_TEST
    ],
    treatment: [
      TREATMENTS.START_IV_ANTIBIOTICS
    ],
    treatmentTime: 4        // antibiotics within 4 h
  },

  [CONDITION_IDS.COMPARTMENT_SYNDROME]: {
    id: CONDITION_IDS.COMPARTMENT_SYNDROME,
    label: "Compartment syndrome",
    description:
      "Elevated pressure within a closed muscle compartment, causing pain, swelling and vascular compromise.",
    symptoms: [
      SYMPTOMS.UNSPECIFIED_PAIN,
      SYMPTOMS.SWELLING,
      SYMPTOMS.RAPID_PULSE
    ],
    stabilisation: STABILISATION_STEPS.STOP_BLEEDING,
    stabilisationTime: 1,   // halt bleeding within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.PHYSICAL_EXAM,
      DIAGNOSIS_TOOLS.CT_SCAN
    ],
    treatment: [
      TREATMENTS.PREPARE_FOR_SURGERY
    ],
    treatmentTime: 4        // fasciotomy prep within 4 h
  },

  [CONDITION_IDS.PERSISTENT_DEFORMITY]: {
    id: CONDITION_IDS.PERSISTENT_DEFORMITY,
    label: "Persistent deformity",
    description:
      "Residual malalignment of bone or joint after trauma, leading to pain and functional impairment.",
    symptoms: [
      SYMPTOMS.BRUISING,
      SYMPTOMS.SWELLING,
      SYMPTOMS.JOINT_PAIN
    ],
    stabilisation: STABILISATION_STEPS.START_IV_FLUIDS,
    stabilisationTime: 1, // Permanent deformation
    diagnosis: [
      DIAGNOSIS_TOOLS.PHYSICAL_EXAM,
      DIAGNOSIS_TOOLS.XRAY
    ],
    treatment: [
      TREATMENTS.REDUCE_DISLOCATION
    ],
    treatmentTime: 6        // ortho reduction within 6 h
  },

  [CONDITION_IDS.SEPSIS_SPREAD]: {
    id: CONDITION_IDS.SEPSIS_SPREAD,
    label: "Sepsis spread",
    description:
      "Life-threatening organ dysfunction due to dysregulated host response to infection.",
    symptoms: [
      SYMPTOMS.HIGH_FEVER,
      SYMPTOMS.RAPID_PULSE,
      SYMPTOMS.CONFUSION
    ],
    stabilisation: STABILISATION_STEPS.START_IV_FLUIDS,
    stabilisationTime: 0.5,   // aggressive fluid resuscitation within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_TEST,
      DIAGNOSIS_TOOLS.BLOOD_PRESSURE_CHECK
    ],
    treatment: [
      TREATMENTS.START_IV_ANTIBIOTICS
    ],
    treatmentTime: 1        // give antibiotics within 1 h
  },

  [CONDITION_IDS.HYPOVOLOAEMIC_SHOCK]: {
    id: CONDITION_IDS.HYPOVOLOAEMIC_SHOCK,
    label: "Hypovolaemic shock",
    description:
      "Critical drop in circulating blood volume leading to hypotension and end-organ hypoperfusion.",
    symptoms: [
      SYMPTOMS.LOW_TEMPERATURE,
      SYMPTOMS.RAPID_PULSE,
      SYMPTOMS.CONFUSION
    ],
    stabilisation: STABILISATION_STEPS.START_IV_FLUIDS,
    stabilisationTime: 0.5,   // volume replacement within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_PRESSURE_CHECK,
      DIAGNOSIS_TOOLS.BLOOD_TEST
    ],
    treatment: [
      TREATMENTS.START_IV_ANTIBIOTICS
    ],
    treatmentTime: 1        // repeat fluids/antibiotics within 1 h
  },

  [CONDITION_IDS.TRANSFUSION_REACTION]: {
    id: CONDITION_IDS.TRANSFUSION_REACTION,
    label: "Transfusion reaction",
    description:
      "Immune-mediated reaction to transfused blood products, often presenting with fever, rash or hypotension.",
    symptoms: [
      SYMPTOMS.RASH,
      SYMPTOMS.PALPITATIONS,
      SYMPTOMS.MILD_FEVER
    ],
    stabilisation: STABILISATION_STEPS.EPINEPHRINE_SHOT,
    stabilisationTime: 0.5,   // treat anaphylaxis within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_TEST,
      DIAGNOSIS_TOOLS.BLOOD_PRESSURE_CHECK
    ],
    treatment: [
      TREATMENTS.ADMINISTER_MEDICATION
    ],
    treatmentTime: 2        // supportive meds within 2 h
  },

  [CONDITION_IDS.RESPIRATORY_FAILURE]: {
    id: CONDITION_IDS.RESPIRATORY_FAILURE,
    label: "Respiratory failure",
    description:
      "Inadequate gas exchange by the respiratory system, leading to hypoxia and/or hypercapnia.",
    symptoms: [
      SYMPTOMS.SHORT_OF_BREATH,
      SYMPTOMS.GASPING,
      SYMPTOMS.CONFUSION
    ],
    stabilisation: STABILISATION_STEPS.GIVE_OXYGEN,
    stabilisationTime: 0.25,   // oxygen support within 1 h
    diagnosis: [
      DIAGNOSIS_TOOLS.PULSE_OXIMETRY,
      DIAGNOSIS_TOOLS.BLOOD_TEST
    ],
    treatment: [
      TREATMENTS.PROVIDE_RESPIRATORY_THERAPY
    ],
    treatmentTime: 2        // nebuliser/inhaler within 2 h
  },


  // Conditions caused by failing stabilisation checks
   [CONDITION_IDS.HEMORRHAGIC_SHOCK]: {
    id:               CONDITION_IDS.HEMORRHAGIC_SHOCK,
    label:            "Hemorrhagic shock",
    description:
      "Massive blood loss leading to critical hypoperfusion and risk of cardiac arrest.",
    symptoms: [
      SYMPTOMS.RAPID_PULSE,
      SYMPTOMS.LOW_TEMPERATURE,
      SYMPTOMS.CONFUSION
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,   // must defibrillate within 15 min or fatal
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_PRESSURE_CHECK,
      DIAGNOSIS_TOOLS.BLOOD_TEST
    ],
    treatment: [
      TREATMENTS.TRANSFUSE_BLOOD
    ],
    treatmentTime:    1        // definitive hemorrhage control within 1 h
  },

  [CONDITION_IDS.TENSION_PNEUMOTHORAX]: {
    id:               CONDITION_IDS.TENSION_PNEUMOTHORAX,
    label:            "Tension pneumothorax",
    description:
      "Air under pressure in the chest rapidly collapses the lung and shifts mediastinum.",
    symptoms: [
      SYMPTOMS.SHORT_OF_BREATH,
      SYMPTOMS.CHEST_PAIN,
      SYMPTOMS.LABOURED_BREATHING
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,   // 15 min to avert cardiac arrest
    diagnosis: [
      DIAGNOSIS_TOOLS.PHYSICAL_EXAM,
      DIAGNOSIS_TOOLS.XRAY
    ],
    treatment: [
        TREATMENTS.PREPARE_FOR_SURGERY
    ],
    treatmentTime:    1
  },

  [CONDITION_IDS.ANAPHYLACTIC_SHOCK]: {
    id:               CONDITION_IDS.ANAPHYLACTIC_SHOCK,
    label:            "Anaphylactic shock",
    description:
      "Widespread histamine release causes airway compromise and hypotension.",
    symptoms: [
      SYMPTOMS.SWELLING,
      SYMPTOMS.WHEEZING,
      SYMPTOMS.PALPITATIONS
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,   // 15 min or go into cardiac arrest
    diagnosis: [
      DIAGNOSIS_TOOLS.PHYSICAL_EXAM,
      DIAGNOSIS_TOOLS.PULSE_OXIMETRY
    ],
    treatment: [
      TREATMENTS.ADMINISTER_MEDICATION
    ],
    treatmentTime:    0.5      // repeat epi/support within 30 min
  },

  [CONDITION_IDS.HYPOGLYCAEMIC_COMA]: {
    id:               CONDITION_IDS.HYPOGLYCAEMIC_COMA,
    label:            "Hypoglycaemic coma",
    description:
      "Severe low blood sugar leading to unconsciousness and risk of arrest.",
    symptoms: [
      SYMPTOMS.INCOHERENT_SPEECH,
      SYMPTOMS.DELAYED_RESPONSES,
      SYMPTOMS.CONFUSION
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_SUGAR_TEST
    ],
    treatment: [
      TREATMENTS.ADMINISTER_MEDICATION
    ],
    treatmentTime:    0.5
  },

  [CONDITION_IDS.STATUS_EPILEPTICUS]: {
    id:               CONDITION_IDS.STATUS_EPILEPTICUS,
    label:            "Status epilepticus",
    description:
      "Continuous seizure activity with high risk of progression to arrest.",
    symptoms: [
      SYMPTOMS.SHAKING_FITS,
      SYMPTOMS.TONGUE_BITE,
      SYMPTOMS.CONFUSION
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,
    diagnosis: [
      DIAGNOSIS_TOOLS.EEG_TEST,
      DIAGNOSIS_TOOLS.CT_SCAN
    ],
    treatment: [
      TREATMENTS.ADMINISTER_MEDICATION
    ],
    treatmentTime:    0.5
  },

  [CONDITION_IDS.SEVERE_HYPOXIA]: {
    id:               CONDITION_IDS.SEVERE_HYPOXIA,
    label:            "Severe hypoxia",
    description:
      "Critical oxygen deprivation risking cardiac collapse.",
    symptoms: [
      SYMPTOMS.GASPING,
      SYMPTOMS.CHEST_HEAVING,
      SYMPTOMS.CONFUSION
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,
    diagnosis: [
      DIAGNOSIS_TOOLS.PULSE_OXIMETRY,
      DIAGNOSIS_TOOLS.BLOOD_TEST
    ],
    treatment: [
      TREATMENTS.PROVIDE_RESPIRATORY_THERAPY
    ],
    treatmentTime:    0.5
  },

  [CONDITION_IDS.HEAT_STROKE_HYPOTHERMIA]: {
    id:               CONDITION_IDS.HEAT_STROKE_HYPOTHERMIA,
    label:            "Heat stroke / Hypothermia",
    description:
      "Severe temperature dysregulation risking organ failure and arrest.",
    symptoms: [
      SYMPTOMS.LOW_TEMPERATURE,
      SYMPTOMS.HIGH_FEVER,
      SYMPTOMS.DIZZINESS
    ],
    stabilisation:    STABILISATION_STEPS.DEFIBRILLATION,
    stabilisationTime: 0.25,
    diagnosis: [
      DIAGNOSIS_TOOLS.BLOOD_TEST,
      DIAGNOSIS_TOOLS.BLOOD_PRESSURE_CHECK
    ],
    treatment: [
        TREATMENTS.PREPARE_FOR_SURGERY
    ],
    treatmentTime:    1
  }

  
};