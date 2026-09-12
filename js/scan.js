/* =========================================================
   scan.js
   Step 3 — "Scan". Simulates the document digitisation pipeline:
   patient taps "scan", we show a short "reading document" pause,
   then reveal the fields a real OCR/document-AI model would have
   extracted (diagnoses, medicines, lab values — with abnormal
   values already flagged).

   Swap `mockDocs` and the setTimeout delay for a real call to an
   OCR/document-AI endpoint to make this production-ready.
   ========================================================= */

function scanDoc(){
  if(state.docs.length >= mockDocs.length) return;

  document.getElementById('scanningRow').innerHTML =
    `<p class="scanning-note">Reading document, please wait…</p>`;

  setTimeout(() => {
    document.getElementById('scanningRow').innerHTML = '';
    const doc = mockDocs[state.docs.length];
    state.docs.push(doc);
    renderDocList();

    if(state.docs.length >= mockDocs.length){
      document.getElementById('scanZone').style.display = 'none';
    }
    document.getElementById('scanContinue').style.display = 'block';
    document.getElementById('scanSkip').textContent = 'Continue';
  }, 1100);
}

function renderDocList(){
  document.getElementById('docList').innerHTML = state.docs.map(doc => `
    <div class="doc-card">
      <div class="doc-card-head"><span>${doc.title}</span><span class="doc-date">${doc.date}</span></div>
      ${doc.fields.map(f => `
        <div class="doc-field">
          <span>${f.label}</span>
          <span class="val ${f.flag === 'alert' ? 'val-alert' : f.flag === 'warn' ? 'val-warn' : ''}">
            ${f.value}${f.note ? ` — ${f.note}` : ''}
          </span>
        </div>`).join('')}
      <span class="doc-confidence">Read successfully</span>
    </div>
  `).join('');
}

function finishScan(){
  goTo('s-summarize');
  runSummary();
}
