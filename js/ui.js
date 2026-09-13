// ui.js - Screen Transitions & UI Navigation

function goToStep(stepNumber) {
  state.currentStep = stepNumber;

  // Update step indicator
  document.getElementById('step-indicator').innerText = `Step ${stepNumber} of 5`;

  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));

  // Show active screen
  switch (stepNumber) {
    case 1:
      document.getElementById('screen-identify').classList.remove('hidden');
      break;
    case 2:
      document.getElementById('screen-converse').classList.remove('hidden');
      initConverseScreen();
      break;
    case 3:
      document.getElementById('screen-scan').classList.remove('hidden');
      break;
    case 4:
      document.getElementById('screen-summary').classList.remove('hidden');
      runSummaryAnimation();
      break;
    case 5:
      document.getElementById('screen-doctor').classList.remove('hidden');
      buildDoctorConsole();
      break;
  }
}

function showRedFlagBanner(title, message) {
  state.isRedFlag = true;
  const alertEl = document.getElementById('red-flag-alert');
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = message;
  alertEl.classList.remove('hidden');
}
