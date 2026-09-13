// doctor.js - Doctor's OPD EMR Dashboard Generation

function buildDoctorConsole() {
  document.getElementById('doc-patient-id').innerText = state.patientInfo.id;
  document.getElementById('doc-opd-type').innerText = state.opdType.toUpperCase();

  const summaryContainer = document.getElementById('doc-summary-content');
  summaryContainer.innerHTML = '';

  // Render Conversational History
  const historySec = document.createElement('div');
  historySec.className = 'summary-section';
  historySec.innerHTML = `<h4>Elicited History (Source: Conversational Kiosk)</h4>`;
  
  for (let key in state.conversation.answers) {
    historySec.innerHTML += `<p><strong>${key.toUpperCase()}:</strong> ${state.conversation.answers[key]}</p>`;
  }
  summaryContainer.appendChild(historySec);

  // Render Document Intelligent Timeline
  const timelineContainer = document.getElementById('doc-ocr-timeline');
  timelineContainer.innerHTML = '';

  if (state.ocrData) {
    timelineContainer.innerHTML = `
      <div class="summary-section">
        <h4>Document Scanned: ${state.ocrData.type} (${state.ocrData.date})</h4>
        <p><strong>Known Conditions:</strong> ${state.ocrData.diagnoses.join(', ')}</p>
        <p><strong>Active Meds:</strong> ${state.ocrData.medications.join(', ')}</p>
        <h4>Key Lab Values:</h4>
        <ul>
          ${state.ocrData.labs.map(l => `<li>${l.test}: <strong>${l.value}</strong> ${l.isAbnormal ? '<span class="abnormal-tag">ABNORMAL</span>' : ''}</li>`).join('')}
        </ul>
      </div>
    `;
  } else {
    timelineContainer.innerText = "No physical records scanned during this session.";
  }
}
