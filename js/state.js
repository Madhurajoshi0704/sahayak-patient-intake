// state.js - Central Application State and Question Ontologies

const state = {
  currentStep: 1,
  language: 'en',
  opdType: 'allopathy', // 'allopathy' or 'ayush'
  patientInfo: {
    id: '',
    consentGiven: false
  },
  conversation: {
    currentQuestionId: 'cc',
    answers: {},
    history: []
  },
  ocrData: null,
  isRedFlag: false
};

// Allopathy Question Framework (SOCRATES embedded for pain)
const allopathyQuestions = {
  'cc': {
    question: "What primary symptom or trouble brought you to the hospital today?",
    options: ["Chest Pain / Pressure", "Fever & Cough", "Severe Stomach Ache", "Joint Pain"]
  },
  'socrates_onset': {
    question: "When did this symptoms/pain start, and was it sudden or gradual?",
    options: ["Sudden (Less than 2 hours)", "Gradual (Past 2-3 days)", "Chronic (More than 2 weeks)"]
  },
  'socrates_character': {
    question: "How would you describe the sensation?",
    options: ["Sharp / Stabbing", "Heavy / Squeezing Pressure", "Dull Ache", "Burning"]
  },
  'past_history': {
    question: "Do you have any existing medical conditions?",
    options: ["Diabetes", "Hypertension (High BP)", "Asthma / Breathing Issue", "None"]
  }
};

// AYUSH Question Framework (Dashavidha & Pariksha Parameters)
const ayushQuestions = {
  'cc': {
    question: "What main discomfort or imbalance (Vikriti) are you experiencing?",
    options: ["Joint Inflammation (Vata)", "Acid Reflux / Burning (Pitta)", "Digestive Sluggishness (Agni Mandya)", "Chronic Cough (Kapha)"]
  },
  'agni': {
    question: "How is your digestive capacity (Agni)?",
    options: ["Tikshnagni (Excessive hunger)", "Mandagni (Slow digestion/bloating)", "Vishamagni (Irregular digestive power)", "Samagni (Balanced)"]
  },
  'koshtha': {
    question: "Describe your bowel habits (Koshtha):",
    options: ["Krura (Hard/Constipated)", "Mridu (Soft/Loose)", "Madhyama (Regular)"]
  },
  'prakriti': {
    question: "What is your baseline body tendency (Prakriti)?",
    options: ["Dry skin / Sensitive to cold (Vata)", "Heat intolerance / Quick anger (Pitta)", "Heavy frame / Sleepy (Kapha)", "Don't know"]
  }
};

// Sample OCR Preset Results for Step 3 Simulation
const sampleOcrPresets = [
  {
    type: "Lab Report - Complete Blood Count & Metabolic Panel",
    date: "2026-03-10",
    diagnoses: ["Type 2 Diabetes Mellitus", "Mild Anemia"],
    medications: ["Metformin 500mg (BD)", "Amlodipine 5mg (OD)"],
    labs: [
      { test: "Hemoglobin", value: "9.5 g/dL", isAbnormal: true, range: "12.0 - 15.5 g/dL" },
      { test: "Fasting Blood Sugar", value: "185 mg/dL", isAbnormal: true, range: "70 - 100 mg/dL" },
      { test: "Serum Creatinine", value: "0.9 mg/dL", isAbnormal: false, range: "0.6 - 1.2 mg/dL" }
    ]
  }
];

// Helper to reset state completely (Data DPDP Act security)
function resetGlobalState() {
  state.currentStep = 1;
  state.language = 'en';
  state.opdType = 'allopathy';
  state.patientInfo = { id: '', consentGiven: false };
  state.conversation = { currentQuestionId: 'cc', answers: {}, history: [] };
  state.ocrData = null;
  state.isRedFlag = false;
}
