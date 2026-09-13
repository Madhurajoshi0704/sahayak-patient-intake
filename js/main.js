// main.js - App Initialization & DPDP Session Wipe

document.addEventListener('DOMContentLoaded', () => {
  console.log("Sahayak Patient Intake Kiosk initialized.");
  goToStep(1);
});

// Resets state & wipes all local temporary session data for DPDP Act Compliance
function resetApp() {
  resetGlobalState();
  
  document.getElementById('auth-id').value = '';
  document.getElementById('consent-check').checked = false;
  document.getElementById('btn-step1-next').disabled = true;
  document.getElementById('red-flag-alert').classList.add('hidden');
  
  goToStep(1);
}
