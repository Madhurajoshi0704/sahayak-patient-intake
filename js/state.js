/* =========================================================
   state.js
   All the data the app works with lives here:
   - `state`   : what the current patient has told us so far
   - `languages`: list shown on the welcome screen
   - `convo`   : the branching question script for Step 2
   - `mockDocs`: the two sample documents used in Step 3

   In a real deployment, `convo` and `mockDocs` would instead
   come from a clinical-history ontology and an OCR/document-AI
   service. Here they are hard-coded so the whole flow can be
   demoed without any backend.
   ========================================================= */

const state = {
  lang: 'English',
  idMode: 'abha',     // 'abha' or 'new'
  answers: {},        // answers collected during the Step 2 conversation
  path: null,          // which conversation branch was taken ('chestpain' or a generic complaint)
  redFlag: false,      // true if a red-flag symptom combination was detected
  docs: [],            // documents "scanned" during Step 3
};

// [native name, English name] — shown on the welcome screen
const languages = [
  ['English', 'English'],
  ['हिन्दी', 'Hindi'],
  ['ಕನ್ನಡ', 'Kannada'],
  ['தமிழ்', 'Tamil'],
  ['বাংলা', 'Bengali'],
  ['मराठी', 'Marathi'],
];

// Step 2 conversation script.
// Each node has:
//   ai       -> what the assistant "says"
//   options  -> the answers the patient can pick (voice or tap)
//   next     -> which node to go to after this answer ('END' finishes the interview)
//   key      -> where the answer is stored in state.answers
//   redFlag  -> true if choosing this answer should trigger the priority alert
const convo = {
  start: { ai: "What brings you in today?", options: [
    { label: 'Chest pain',     next: 'cp_since', key: 'complaint' },
    { label: 'Fever',          next: 'g_since',  key: 'complaint' },
    { label: 'Stomach ache',   next: 'g_since',  key: 'complaint' },
    { label: 'Cough',          next: 'g_since',  key: 'complaint' },
  ]},
  cp_since: { ai: "Since when have you had this pain?", options: [
    { label: 'Since today',        next: 'cp_character', key: 'since' },
    { label: '2–3 days',           next: 'cp_character', key: 'since' },
    { label: 'More than a week',   next: 'cp_character', key: 'since' },
  ]},
  cp_character: { ai: "Can you describe the pain?", options: [
    { label: 'Sharp',                next: 'cp_radiate', key: 'character' },
    { label: 'Dull ache',             next: 'cp_radiate', key: 'character' },
    { label: 'Burning',               next: 'cp_radiate', key: 'character' },
    { label: 'Pressure or heaviness', next: 'cp_radiate', key: 'character' },
  ]},
  cp_radiate: { ai: "Does the pain spread anywhere — to your arm, jaw, or back?", options: [
    { label: 'Yes, it spreads', next: 'cp_breathless', key: 'radiate' },
    { label: 'No',              next: 'cp_breathless', key: 'radiate' },
  ]},
  cp_breathless: { ai: "Do you also feel breathless, or short of breath?", options: [
    { label: 'Yes', next: 'cp_allergy', key: 'breathless', redFlag: true },
    { label: 'No',  next: 'cp_allergy', key: 'breathless' },
  ]},
  cp_allergy: { ai: "Any known drug allergies?", options: [
    { label: 'None',         next: 'cp_meds', key: 'allergy' },
    { label: 'Penicillin',   next: 'cp_meds', key: 'allergy' },
    { label: 'Sulfa drugs',  next: 'cp_meds', key: 'allergy' },
  ]},
  cp_meds: { ai: "Are you currently taking any regular medicine?", options: [
    { label: 'None',                     next: 'END', key: 'meds' },
    { label: 'Blood pressure tablets',   next: 'END', key: 'meds' },
    { label: 'Diabetes tablets',         next: 'END', key: 'meds' },
  ]},
  g_since: { ai: "Since when have you had this?", options: [
    { label: 'Since today',       next: 'g_allergy', key: 'since' },
    { label: '2–3 days',          next: 'g_allergy', key: 'since' },
    { label: 'More than a week',  next: 'g_allergy', key: 'since' },
  ]},
  g_allergy: { ai: "Any known drug allergies?", options: [
    { label: 'None',       next: 'END', key: 'allergy' },
    { label: 'Penicillin', next: 'END', key: 'allergy' },
  ]},
};

// Step 3 sample documents — stands in for a real OCR/document-AI pipeline
const mockDocs = [
  { title: 'Prescription', date: '12 Mar 2026', fields: [
      { label: 'Diagnosis',     value: 'Hypertension (Stage 1)' },
      { label: 'Medicine',      value: 'Amlodipine 5mg — once daily' },
      { label: 'Prescribed by', value: 'Dr. Mehta, City Hospital' },
  ]},
  { title: 'Lab report', date: '18 Aug 2026', fields: [
      { label: 'HbA1c',           value: '7.8%',        flag: 'alert', note: 'above normal range (4.0–5.6%)' },
      { label: 'Fasting glucose', value: '142 mg/dL',   flag: 'warn',  note: 'slightly high' },
      { label: 'Blood pressure',  value: '138/88 mmHg' },
  ]},
];
