/* =========================================================
   ui.js
   Small, shared navigation helpers used by every step.
   Keeping this separate means the rest of the code just calls
   goTo('s-scan') and doesn't need to know how screens are
   shown/hidden or how the step indicator text is worked out.
   ========================================================= */

// Every patient-facing screen, in order, with the step label
// shown above it. Used to build "Step X of 5 — ..." automatically.
const stepOrder = [
  { id: 's-welcome',    label: 'Tell us who you are' },
  { id: 's-identify',   label: 'Tell us who you are' },
  { id: 's-converse',   label: "Tell us what's wrong" },
  { id: 's-scan',       label: 'Scan any old documents' },
  { id: 's-summarize',  label: 'Preparing your summary' },
];

function goTo(id){
  document.querySelectorAll('#patientPage .screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const idx = stepOrder.findIndex(s => s.id === id);
  const stepNum = Math.max(idx, 0) + 1; // welcome and identify both count as step 1
  document.getElementById('stepText').textContent = `Step ${stepNum} of 5 — ${stepOrder[idx].label}`;
  document.getElementById('progressFill').style.width = (stepNum / 5 * 100) + '%';

  document.getElementById('patientPage').style.display = 'block';
  document.getElementById('doctorPage').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'block';
}
