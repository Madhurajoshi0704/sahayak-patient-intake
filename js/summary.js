/* =========================================================
   summary.js
   Step 4 — "Summarize & Route". Purely a status checklist —
   in a real system each line corresponds to an actual backend
   step (LLM summarisation call, FHIR push to the HIS, ABHA
   linking API, etc.). Here each line just ticks itself off in
   sequence so the patient can see progress instead of a blank
   loading screen.
   ========================================================= */

function runSummary(){
  const items = [
    'Putting together what you told us',
    `Adding ${state.docs.length} scanned document${state.docs.length === 1 ? '' : 's'}`,
    'Writing this up the way the doctor reads it',
    'Linking it to your health account',
    'Sending it to the hospital system',
  ];

  const list = document.getElementById('checklist');
  list.innerHTML = items.map((t, i) => `<li id="cl${i}"><span class="tick">✓</span><span>${t}</span></li>`).join('');
  document.getElementById('handoverBtn').style.display = 'none';

  items.forEach((_, i) => {
    setTimeout(() => {
      document.getElementById('cl' + i).classList.add('show');
      if(i === items.length - 1){
        setTimeout(() => document.getElementById('handoverBtn').style.display = 'block', 300);
      }
    }, 400 + i * 500);
  });
}
