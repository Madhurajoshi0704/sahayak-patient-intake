/* =========================================================
   identify.js
   Step 1 — "Identify". Handles:
   - rendering the language buttons on the welcome screen
   - switching between "I have an ABHA ID" and "first visit"
   - only unlocking "Continue" once an ID/name is entered AND
     the consent box is ticked (this mirrors the "consent-first
     design" requirement in the problem statement)
   ========================================================= */

function renderLangs(){
  const grid = document.getElementById('langGrid');
  grid.innerHTML = languages.map(([native, eng]) => `
    <button class="lang-chip ${eng === state.lang ? 'selected' : ''}" onclick="pickLang('${eng}', this)">
      ${native}<span class="native-sub">${eng}</span>
    </button>
  `).join('');
}

function pickLang(eng, el){
  state.lang = eng;
  document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectIdMode(mode){
  state.idMode = mode;
  document.getElementById('opt-abha').classList.toggle('selected', mode === 'abha');
  document.getElementById('opt-new').classList.toggle('selected', mode === 'new');
  document.getElementById('idLabel').textContent = mode === 'abha' ? 'ABHA ID' : 'Full name';
  document.getElementById('idInput').placeholder = mode === 'abha' ? '14-2536-XXXX-XXXX' : 'Enter your name';
}

function checkIdentifyReady(){
  const hasId = document.getElementById('idInput').value.trim().length > 2;
  const consented = document.getElementById('consentBox').checked;
  document.getElementById('identifyContinue').disabled = !(hasId && consented);
}

function playListen(btn){
  // Placeholder for a real text-to-speech call. Kept as a plain
  // button-text change rather than an animation, since the
  // audio playback itself is the meaningful feedback, not a visual effect.
  const original = btn.textContent;
  btn.textContent = '🔊 Playing…';
  setTimeout(() => btn.textContent = original, 1500);
}
