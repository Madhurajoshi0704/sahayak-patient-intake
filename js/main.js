/* =========================================================
   main.js
   Runs once the page loads: renders the language list, wires
   up the two Step-1 inputs so "Continue" only unlocks once
   both are filled in, and provides the "Start over" reset.
   ========================================================= */

renderLangs();

document.getElementById('idInput').addEventListener('input', checkIdentifyReady);
document.getElementById('consentBox').addEventListener('change', checkIdentifyReady);

function restartDemo(){
  state.answers = {};
  state.path = null;
  state.redFlag = false;
  state.docs = [];

  document.getElementById('idInput').value = '';
  document.getElementById('consentBox').checked = false;
  document.getElementById('identifyContinue').disabled = true;

  document.getElementById('scanZone').style.display = 'block';
  document.getElementById('scanContinue').style.display = 'none';
  document.getElementById('scanSkip').textContent = 'I have no documents';
  document.getElementById('docList').innerHTML = '';
  document.getElementById('scanningRow').innerHTML = '';

  document.getElementById('doctorPage').style.display = 'none';
  document.getElementById('stepIndicator').style.display = 'block';
  document.getElementById('patientPage').style.display = 'block';

  goTo('s-welcome');
}
