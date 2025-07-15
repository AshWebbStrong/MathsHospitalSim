/* common/definitions/symptoms.ts */

// Define machine-friendly category IDs
export const SYMPTOM_CATEGORIES = {
  TYPES_OF_PAIN: "typesOfPain",
  CONVERSATION_CUES: "conversationCues",
  VISUAL_BODY_SIGNS: "visualBodySigns",
  TEMPERATURE_SIGNS: "temperatureSigns",
  BREATHING_HEART_CUES: "breathingHeartCues",
  OTHER: "other",
} as const;

export type SymptomCategory = typeof SYMPTOM_CATEGORIES[keyof typeof SYMPTOM_CATEGORIES];

// Symptom definition with stable key and display label
export interface Symptom {
  id: string;            // machine-friendly identifier
  label: string;         // human-friendly text
  category: SymptomCategory;
}

// Central lookup of all symptoms by their ID
export const SYMPTOMS: Record<string, Symptom> = {
  // 1️⃣ Pain (head → feet)
  HEADACHE:           { id: "HEADACHE",           label: "Headache",          category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  EAR_PAIN:           { id: "EAR_PAIN",           label: "Ear pain",          category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  SORE_THROAT:        { id: "SORE_THROAT",        label: "Sore throat",       category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  CHEST_PAIN:         { id: "CHEST_PAIN",         label: "Chest pain",        category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  SHARP_BELLY_PAIN:   { id: "SHARP_BELLY_PAIN",   label: "Sharp belly pain",  category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  BACK_PAIN:          { id: "BACK_PAIN",          label: "Back pain",         category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  WRIST_PAIN:         { id: "WRIST_PAIN",         label: "Wrist pain",        category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  JOINT_PAIN:         { id: "JOINT_PAIN",         label: "Joint pain",        category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  ANKLE_PAIN:         { id: "ANKLE_PAIN",         label: "Ankle pain",        category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },
  UNSPECIFIED_PAIN:   { id: "UNSPECIFIED_PAIN",   label: "Unspecified pain",  category: SYMPTOM_CATEGORIES.TYPES_OF_PAIN },

  // 2️⃣ Cognitive / speech clues
  CONFUSION:           { id: "CONFUSION",           label: "Confusion",             category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  SLURRED_SPEECH:      { id: "SLURRED_SPEECH",      label: "Slurred speech",       category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  FATIGUE:             { id: "FATIGUE",             label: "Fatigue",              category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  MEMORY_LOSS:         { id: "MEMORY_LOSS",         label: "Memory loss",          category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  DELAYED_RESPONSES:   { id: "DELAYED_RESPONSES",   label: "Delayed responses",     category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  INCOHERENT_SPEECH:   { id: "INCOHERENT_SPEECH",   label: "Incoherent speech",     category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  AGITATION:           { id: "AGITATION",           label: "Agitation",            category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  HALLUCINATIONS:      { id: "HALLUCINATIONS",      label: "Hallucinations",       category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },
  INAPPROPRIATE_ANSWERS:{ id: "INAPPROPRIATE_ANSWERS", label: "Inappropriate answers", category: SYMPTOM_CATEGORIES.CONVERSATION_CUES },

  // 3️⃣ Visual body signs
  SWEATING:            { id: "SWEATING",            label: "Sweating",             category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  RASH:                { id: "RASH",                label: "Rash",                 category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  BRUISING:            { id: "BRUISING",            label: "Bruising",             category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  SWELLING:            { id: "SWELLING",            label: "Swelling",             category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  FACIAL_DROOP:        { id: "FACIAL_DROOP",        label: "Facial droop",         category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  OPEN_WOUND:          { id: "OPEN_WOUND",          label: "Open wound",           category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  BLEEDING:            { id: "BLEEDING",            label: "Bleeding",             category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  WEAK_ARM_LEG:        { id: "WEAK_ARM_LEG",        label: "Weak arm/leg",         category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  SHAKING_FITS:        { id: "SHAKING_FITS",        label: "Shaking fits",         category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  TONGUE_BITE:         { id: "TONGUE_BITE",         label: "Tongue bite",          category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },
  SWOLLEN_AIRWAY:      { id: "SWOLLEN_AIRWAY",      label: "Swollen airway",       category: SYMPTOM_CATEGORIES.VISUAL_BODY_SIGNS },

  // 4️⃣ Temperature clues
  HIGH_FEVER:          { id: "HIGH_FEVER",          label: "High fever",           category: SYMPTOM_CATEGORIES.TEMPERATURE_SIGNS },
  MILD_FEVER:          { id: "MILD_FEVER",          label: "Mild fever",           category: SYMPTOM_CATEGORIES.TEMPERATURE_SIGNS },
  LOW_TEMPERATURE:     { id: "LOW_TEMPERATURE",     label: "Low temperature",      category: SYMPTOM_CATEGORIES.TEMPERATURE_SIGNS },

  // 5️⃣ Breathing / heart-rate cues
  SHORT_OF_BREATH:     { id: "SHORT_OF_BREATH",     label: "Short of breath",      category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  FAST_BREATHING:      { id: "FAST_BREATHING",      label: "Fast breathing",       category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  WHEEZING:            { id: "WHEEZING",            label: "Wheezing",             category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  LABOURED_BREATHING:  { id: "LABOURED_BREATHING",  label: "Laboured breathing",   category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  GASPING:             { id: "GASPING",             label: "Gasping",              category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  CHEST_HEAVING:       { id: "CHEST_HEAVING",       label: "Chest heaving",        category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  RAPID_PULSE:         { id: "RAPID_PULSE",         label: "Rapid pulse",          category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  IRREGULAR_PULSE:     { id: "IRREGULAR_PULSE",     label: "Irregular pulse",      category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },
  PALPITATIONS:        { id: "PALPITATIONS",        label: "Palpitations",         category: SYMPTOM_CATEGORIES.BREATHING_HEART_CUES },

  // 6️⃣ Other signs
  NAUSEA:              { id: "NAUSEA",              label: "Nausea",               category: SYMPTOM_CATEGORIES.OTHER },
  VOMITING:            { id: "VOMITING",            label: "Vomiting",             category: SYMPTOM_CATEGORIES.OTHER },
  COUGH:               { id: "COUGH",               label: "Cough",                category: SYMPTOM_CATEGORIES.OTHER },
  EXCESSIVE_THIRST:    { id: "EXCESSIVE_THIRST",    label: "Excessive thirst",     category: SYMPTOM_CATEGORIES.OTHER },
  BLURRED_VISION:      { id: "BLURRED_VISION",      label: "Blurred vision",       category: SYMPTOM_CATEGORIES.OTHER },
  STIFF_NECK:          { id: "STIFF_NECK",          label: "Stiff neck",           category: SYMPTOM_CATEGORIES.OTHER },
  DIZZINESS:           { id: "DIZZINESS",           label: "Dizziness",            category: SYMPTOM_CATEGORIES.OTHER },
  TIGHT_CHEST:         { id: "TIGHT_CHEST",         label: "Tight chest",          category: SYMPTOM_CATEGORIES.OTHER },
};

// Utility: group symptoms by category for UI lists or filters
export const SYMPTOMS_BY_CATEGORY: Record<SymptomCategory, Symptom[]> =
  Object.values(SYMPTOMS).reduce((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {} as Record<SymptomCategory, Symptom[]>);