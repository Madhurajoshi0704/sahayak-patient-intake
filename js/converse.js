// converse.js - Conversational AI Engine, Voice API & Red Flag Alerting

let recognition;

function initConverseScreen() {
  // Update badge for AYUSH
  const badge = document.getElementById('ayush-badge');
  badge.classList.toggle('hidden', state.opdType !== 'ayush');

  state.conversation.currentQuestionId = 'cc';
  renderQuestion();
}

function renderQuestion() {
  const qSet = state.opdType === 'ayush' ? ayushQuestions : allopathyQuestions;
  const currentQ = qSet[state.conversation.currentQuestionId];

  if (!currentQ) {
    // Interview Complete -> Go to scan step
    goToStep(3);
    return;
  }

  document.getElementById('ai-question').innerText = currentQ.question;
  
  // Speak out question automatically for accessibility
  const speech = new SpeechSynthesisUtterance(currentQ.question);
  speech.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';
  window.speechSynthesis.speak(speech);

  // Render Touch Options (Dual Mode Input)
  const container = document.getElementById('touch-options');
  container.innerHTML = '';
  
  currentQ.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-choice';
    btn.innerText = option;
    btn.onclick = () => handleAnswer(option);
    container.appendChild(btn);
  });
}

function handleAnswer(answerText) {
  const currentId = state.conversation.currentQuestionId;
  state.conversation.answers[currentId] = answerText;
  state.conversation.history.push({ questionId: currentId, answer: answerText });

  // Emergency Red Flag Detection
  if (answerText.includes("Chest Pain") || answerText.includes("Heavy / Squeezing Pressure")) {
    showRedFlagBanner(
      "PRIORITY TRIAGE ALERT: Acute Symptoms Flagged",
      "Patient reported severe chest pressure/pain. Triaging immediately to emergency clinical desk."
    );
  }

  // Branching Logic
  if (state.opdType === 'allopathy') {
    if (currentId === 'cc') state.conversation.currentQuestionId = answerText.includes("Pain") ? 'socrates_onset' : 'past_history';
    else if (currentId === 'socrates_onset') state.conversation.currentQuestionId = 'socrates_character';
    else if (currentId === 'socrates_character') state.conversation.currentQuestionId = 'past_history';
    else state.conversation.currentQuestionId = null;
  } else {
    // AYUSH Branching
    if (currentId === 'cc') state.conversation.currentQuestionId = 'agni';
    else if (currentId === 'agni') state.conversation.currentQuestionId = 'koshtha';
    else if (currentId === 'koshtha') state.conversation.currentQuestionId = 'prakriti';
    else state.conversation.currentQuestionId = null;
  }

  document.getElementById('voice-text-input').value = '';
  renderQuestion();
}

function submitAnswer() {
  const input = document.getElementById('voice-text-input').value.trim();
  if (input) handleAnswer(input);
}

// Native Speech Recognition Integration
function toggleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported on this browser. Use touch options.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';
    
    recognition.onstart = () => {
      document.getElementById('voice-indicator').classList.remove('hidden');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('voice-text-input').value = transcript;
      document.getElementById('voice-indicator').classList.add('hidden');
    };

    recognition.onerror = () => {
      document.getElementById('voice-indicator').classList.add('hidden');
    };
  }

  recognition.start();
}
