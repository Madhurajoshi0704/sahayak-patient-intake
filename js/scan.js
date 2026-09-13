// scan.js - Medical Document Digitization, OCR Parsing & Lab Alerting

function triggerScanSimulation() {
  document.getElementById('scan-progress').classList.remove('hidden');
  document.getElementById('ocr-results').classList.add('hidden');

  setTimeout(() => {
    state.ocrData = sampleOcrPresets[0];
    document.getElementById('scan-progress').classList.add('hidden');
    renderOcrResults();
  }, 2000);
}

function renderOcrResults() {
  const listEl = document.getElementById('ocr-extracted-list');
  listEl.innerHTML = '';

  // Extracted Diagnoses
  const diagLi = document.createElement('li');
  diagLi.innerHTML = `<strong>Diagnoses Extracted:</strong> ${state.ocrData.diagnoses.join(', ')}`;
  listEl.appendChild(diagLi);

  // Extracted Medications
  const medLi = document.createElement('li');
  medLi.innerHTML = `<strong>Prescribed Drugs:</strong> ${state.ocrData.medications.join(', ')}`;
  listEl.appendChild(medLi);

  // Extracted Lab Values with Abnormal Range Flagging
  state.ocrData.labs.forEach(lab => {
    const li = document.createElement('li');
    let abnormalBadge = lab.isAbnormal ? `<span class="abnormal-tag">⚠️ Out of Range (${lab.range})</span>` : '';
    li.innerHTML = `<strong>${lab.test}:</strong> ${lab.value} ${abnormalBadge}`;
    listEl.appendChild(li);
  });

  document.getElementById('ocr-results').classList.remove('hidden');
}
