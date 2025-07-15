/* common/definitions/diagnosis.ts */

/**
 * Machine-friendly identifiers for each diagnostic tool
 */
export const DIAGNOSIS_TOOL_IDS = {
  PHYSICAL_EXAM:        "physical_exam",
  DETAILED_OBSERVATION: "detailed_observation",
  COGNITIVE_EXAM:       "cognitive_exam",
  VISION_TEST:          "vision_test",

  BLOOD_PRESSURE_CHECK: "blood_pressure_check",
  PULSE_OXIMETRY:       "pulse_oximetry",
  BLOOD_SUGAR_TEST:     "blood_sugar_test",
  BREATHING_TEST:       "breathing_test",

  XRAY:                 "xray",
  CT_SCAN:              "ct_scan",
  MRI_SCAN:             "mri_scan",
  ULTRASOUND:           "ultrasound",
  ENDOSCOPY:            "endoscopy",

  BLOOD_TEST:           "blood_test",
  URINE_TEST:           "urine_test",
  STOOL_TEST:           "stool_test",
  SKIN_SWAB:            "skin_swab",
  ALLERGY_TEST:         "allergy_test",

  ECG_TEST:             "ecg_test",
  EEG_TEST:             "eeg_test",
} as const;

export type DiagnosisToolId = typeof DIAGNOSIS_TOOL_IDS[keyof typeof DIAGNOSIS_TOOL_IDS];

/**
 * Complete definition for a diagnostic tool
 */
export interface DiagnosisTool {
  /** machine-friendly identifier */
  id: DiagnosisToolId;
  /** label shown in UI */
  label: string;
  /** group/category for organization */
  group: DiagnosisGroup;
}

/**
 * Groups for diagnostic tools, matching tool group's category
 */
export type DiagnosisGroup = 
  | "Clinical check"
  | "Point-of-care measures"
  | "Imaging / visualisation"
  | "Lab samples"
  | "Electrical / functional";

/**
 * Master lookup of all diagnostic tools by their ID
 */
export const DIAGNOSIS_TOOLS: {
  [K in keyof typeof DIAGNOSIS_TOOL_IDS]: DiagnosisTool
} = {
  PHYSICAL_EXAM: {
    id:    DIAGNOSIS_TOOL_IDS.PHYSICAL_EXAM,
    label: "Physical exam",
    group: "Clinical check",
  },
  DETAILED_OBSERVATION: {
    id:    DIAGNOSIS_TOOL_IDS.DETAILED_OBSERVATION,
    label: "Detailed observation",
    group: "Clinical check",
  },
  COGNITIVE_EXAM: {
    id:    DIAGNOSIS_TOOL_IDS.COGNITIVE_EXAM,
    label: "Cognitive exam",
    group: "Clinical check",
  },
  VISION_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.VISION_TEST,
    label: "Vision test",
    group: "Clinical check",
  },

  BLOOD_PRESSURE_CHECK: {
    id:    DIAGNOSIS_TOOL_IDS.BLOOD_PRESSURE_CHECK,
    label: "Blood pressure check",
    group: "Point-of-care measures",
  },
  PULSE_OXIMETRY: {
    id:    DIAGNOSIS_TOOL_IDS.PULSE_OXIMETRY,
    label: "Pulse oximetry",
    group: "Point-of-care measures",
  },
  BLOOD_SUGAR_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.BLOOD_SUGAR_TEST,
    label: "Blood sugar test",
    group: "Point-of-care measures",
  },
  BREATHING_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.BREATHING_TEST,
    label: "Breathing test",
    group: "Point-of-care measures",
  },

  XRAY: {
    id:    DIAGNOSIS_TOOL_IDS.XRAY,
    label: "X-ray",
    group: "Imaging / visualisation",
  },
  CT_SCAN: {
    id:    DIAGNOSIS_TOOL_IDS.CT_SCAN,
    label: "CT scan",
    group: "Imaging / visualisation",
  },
  MRI_SCAN: {
    id:    DIAGNOSIS_TOOL_IDS.MRI_SCAN,
    label: "MRI scan",
    group: "Imaging / visualisation",
  },
  ULTRASOUND: {
    id:    DIAGNOSIS_TOOL_IDS.ULTRASOUND,
    label: "Ultrasound",
    group: "Imaging / visualisation",
  },
  ENDOSCOPY: {
    id:    DIAGNOSIS_TOOL_IDS.ENDOSCOPY,
    label: "Endoscopy",
    group: "Imaging / visualisation",
  },

  BLOOD_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.BLOOD_TEST,
    label: "Blood test",
    group: "Lab samples",
  },
  URINE_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.URINE_TEST,
    label: "Urine test",
    group: "Lab samples",
  },
  STOOL_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.STOOL_TEST,
    label: "Stool test",
    group: "Lab samples",
  },
  SKIN_SWAB: {
    id:    DIAGNOSIS_TOOL_IDS.SKIN_SWAB,
    label: "Skin swab",
    group: "Lab samples",
  },
  ALLERGY_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.ALLERGY_TEST,
    label: "Allergy test",
    group: "Lab samples",
  },

  ECG_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.ECG_TEST,
    label: "ECG test",
    group: "Electrical / functional",
  },
  EEG_TEST: {
    id:    DIAGNOSIS_TOOL_IDS.EEG_TEST,
    label: "EEG test",
    group: "Electrical / functional",
  },
};

/**
 * Helper to group tools for UI or filtering by category
 */
export const DIAGNOSIS_TOOLS_BY_GROUP: Record<DiagnosisGroup, DiagnosisTool[]> =
  Object.values(DIAGNOSIS_TOOLS).reduce((acc, tool) => {
    (acc[tool.group] ||= []).push(tool);
    return acc;
  }, {} as Record<DiagnosisGroup, DiagnosisTool[]>);