// identify.js - Auth, Language Selection & Audio Consent

function setOpdType(type) {
  state.opdType = type;
  document.getElementById('opd-allopathy').classList.toggle('active', type === 'allopathy');
  document.getElementById('opd-ayush').classList.toggle('active', type === 'ayush');
}

// Audio-guided consent for low-literacy accessibility
function playAudioConsent() {
  const consentTexts = {
    'en': "Welcome to Sahayak. By checking this box, you grant explicit consent to securely record your medical history and link prior documents to your ABHA health record in accordance with the Digital Personal Data Protection Act 2023.",
    'hi': "सहायक में आपका स्वागत है। इस बॉक्स को चेक करके, आप डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के तहत अपने मेडिकल इतिहास और दस्तावेजों को अपने आभा कार्ड से जोड़ने की सहमति देते हैं।"
  };

  const text = consentTexts[state.language] || consentTexts['en'];
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';

  window.speechSynthesis.speak(speech);
}

function toggleContinueBtn() {
  const isChecked = document.getElementById('consent-check').checked;
  const patientId = document.getElementById('auth-id').value.trim();
  document.getElementById('btn-step1-next').disabled = !(isChecked && patientId.length > 0);
}

document.getElementById('auth-id').addEventListener('input', toggleContinueBtn);

// Language selector binding
document.querySelectorAll('#lang-selector button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#lang-selector button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.language = e.target.getAttribute('data-lang');
  });
});

function submitStep1() {
  state.patientInfo.id = document.getElementById('auth-id').value.trim();
  state.patientInfo.consentGiven = document.getElementById('consent-check').checked;
  goToStep(2);
}
