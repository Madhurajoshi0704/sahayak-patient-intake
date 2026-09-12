/* =========================================================
   doctor.js
   Step 5 — "Consult". This is the part the problem statement
   calls the payoff moment: the doctor sees a ready-made,
   structured history and can edit/confirm it in seconds.

   Two things this file is careful about, on purpose:
   1. Every section is tagged with where it came from
      (patient's own words / a scanned document / written by
      the AI) so the doctor knows how much to trust it.
   2. Nothing here is final until confirmHistory() runs —
      editing is always possible first.
   ========================================================= */

// Turns the raw answers from Step 2 into the sentences a
// doctor would expect to read (Chief Complaint, HPI, etc).
// A real system would use an LLM for this; here it's template
// text so the demo works without any API calls.
function buildSummaryText(){
  const a = state.answers;
  let chief, hpi, drug;

  if(state.path === 'chestpain'){
    chief = `Chest pain, ${(a.since || 'recent onset').toLowerCase()}, ${(a.character || 'unspecified').toLowerCase()} in character` +
            `${a.radiate === 'Yes, it spreads' ? ', radiating' : ''}` +
            `${a.breathless === 'Yes' ? ', with associated breathlessness' : ''}.`;
    hpi = `Patient reports ${(a.character || '').toLowerCase()} chest pain, onset ${(a.since || '').toLowerCase()}` +
          `${a.radiate === 'Yes, it spreads' ? ', radiating to arm/jaw/back' : ', non-radiating'}. ` +
          `${a.breathless === 'Yes' ? 'Associated breathlessness reported — flagged as priority.' : 'No associated breathlessness.'}`;
    drug = `Allergy: ${a.allergy || 'not recorded'}. Current medicine: ${a.meds || 'not recorded'}.`;
  } else {
    const label = a.complaint || 'Presenting complaint';
    chief = `${label}, ${(a.since || 'recent onset').toLowerCase()}.`;
    hpi = `Patient reports ${label.toLowerCase()}, onset ${(a.since || 'unspecified').toLowerCase()}. No red-flag symptoms noted during intake.`;
    drug = `Allergy: ${a.allergy || 'not recorded'}. No regular medicine reported.`;
  }
  return { chief, hpi, drug };
}

function goToDoctor(){
  document.getElementById('patientPage').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'none';
  document.getElementById('doctorPage').style.display = 'block';

  const s = buildSummaryText();
  const labsDoc = state.docs.find(d => d.title === 'Lab report');
  const rxDoc = state.docs.find(d => d.title === 'Prescription');

  document.getElementById('redflagChipZone').innerHTML = state.redFlag
    ? `<span class="redflag-chip">⚠ Priority — chest pain with breathlessness</span>` : '';

  let investigationsHtml = 'No prior investigations were scanned.';
  if(labsDoc){
    investigationsHtml = labsDoc.fields.map(f =>
      `${f.label}: <span class="${f.flag === 'alert' ? 'lab-alert' : f.flag === 'warn' ? 'lab-warn' : ''}">${f.value}</span>${f.note ? ` (${f.note})` : ''}`
    ).join('<br>');
  }

  const pastMedText = rxDoc
    ? `${rxDoc.fields.find(f => f.label === 'Diagnosis')?.value || 'See scanned prescription'} — per prescription from ${rxDoc.fields.find(f => f.label === 'Prescribed by')?.value || 'a prior provider'}.`
    : 'No prior records scanned — first visit to this facility.';

  // Each section: what to show, and where it came from.
  const sections = [
    { title: 'Chief complaint',                 source: "in the patient's own words",         text: s.chief },
    { title: 'History of present illness',      source: 'written by the AI from the interview', text: s.hpi },
    { title: 'Past medical / surgical history', source: rxDoc ? 'from a scanned document' : "in the patient's own words", text: pastMedText },
    { title: 'Drug & allergy history',          source: "in the patient's own words",          text: s.drug },
    { title: 'Family history',                  source: 'not collected — please ask the patient', text: 'Not asked during this intake.' },
    { title: 'Prior investigations',            source: labsDoc ? 'from a scanned document' : "in the patient's own words", text: investigationsHtml },
  ];

  document.getElementById('summaryCol').innerHTML = sections.map((sec, i) => `
    <div class="section-block">
      <div class="section-head">
        <span class="section-title">${sec.title}</span>
        <span class="section-source">${sec.source}</span>
      </div>
      <div class="section-body" id="sec-body-${i}">${sec.text}</div>
      <div class="section-actions">
        <button class="text-btn" id="editbtn-${i}" onclick="toggleEdit(${i})">Edit</button>
        <button class="text-btn" id="verifybtn-${i}" onclick="markVerified(${i})">Looks right</button>
      </div>
    </div>
  `).join('');
}

function toggleEdit(i){
  const el = document.getElementById('sec-body-' + i);
  const btn = document.getElementById('editbtn-' + i);
  const editing = el.getAttribute('contenteditable') === 'true';
  el.setAttribute('contenteditable', editing ? 'false' : 'true');
  btn.textContent = editing ? 'Edit' : 'Save';
  if(!editing) el.focus();
}

function markVerified(i){
  const btn = document.getElementById('verifybtn-' + i);
  btn.textContent = 'Verified';
  btn.classList.add('verified');
}

function flagInaccurate(){
  alert('Noted. This visit will be sent to the team improving the AI, along with your feedback.');
}

function confirmHistory(){
  document.querySelector('.console-body').innerHTML = `
    <div class="done-block">
      <h2>History confirmed</h2>
      <p>Full consultation time is now free for examining the patient, thinking through the diagnosis, and counselling. This record will be saved to the patient's ABHA account after the visit.</p>
    </div>`;
}
