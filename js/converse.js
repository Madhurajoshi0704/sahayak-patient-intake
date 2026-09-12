/* =========================================================
   converse.js
   Step 2 — "Converse". This is a small state machine that
   walks the `convo` tree defined in state.js:

   1. renderNode(id)  -> shows the assistant's question and
                          the answer buttons for that node
   2. answer(id, i)   -> records the chosen answer, checks
                          whether it should trigger the red-flag
                          alert, then moves to the next node

   In a real system, `renderNode`'s text would come from an LLM
   asking a genuinely adaptive follow-up question (and the
   patient's spoken answer would come from an ASR service)
   rather than from a fixed script — but the shape of the
   interaction (ask -> listen -> branch) is the same.
   ========================================================= */

function startConverse(){
  goTo('s-converse');
  document.getElementById('chatLog').innerHTML = '';
  document.getElementById('chipZone').innerHTML = '';
  state.answers = {};
  state.redFlag = false;
  renderNode('start');
}

function addBubble(who, text){
  const log = document.getElementById('chatLog');
  const div = document.createElement('div');
  div.className = 'bubble ' + who;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  return div;
}

function renderNode(nodeId){
  document.getElementById('chipZone').innerHTML = '';
  const log = document.getElementById('chatLog');

  const typing = document.createElement('div');
  typing.className = 'bubble ai typing-dots';
  typing.textContent = '…';
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    typing.remove();

    if(nodeId === 'END'){
      addBubble('ai', "Thank you. That's everything we need for now. Let's check for any old documents next.");
      document.getElementById('chipZone').innerHTML =
        `<button class="btn-primary btn-wide" onclick="goTo('s-scan')">Continue</button>`;
      return;
    }

    const node = convo[nodeId];
    addBubble('ai', node.ai);

    document.getElementById('chipZone').innerHTML =
      `<div class="answer-list">` +
      node.options.map((o, i) => `<button class="answer-btn" onclick="answer('${nodeId}', ${i})">${o.label}</button>`).join('') +
      `</div>`;
  }, 500);
}

function answer(nodeId, idx){
  const opt = convo[nodeId].options[idx];
  addBubble('user', opt.label);
  state.answers[opt.key] = opt.label;

  if(nodeId === 'start'){
    state.path = (opt.label === 'Chest pain') ? 'chestpain' : opt.label.toLowerCase();
  }
  document.getElementById('chipZone').innerHTML = '';

  if(opt.redFlag){
    state.redFlag = true;
    setTimeout(() => {
      const log = document.getElementById('chatLog');
      const banner = document.createElement('div');
      banner.className = 'redflag-banner';
      banner.textContent = '⚠ We have alerted the nurse right away because of your answers. Someone will come to check on you shortly.';
      log.appendChild(banner);
      log.scrollTop = log.scrollHeight;
      setTimeout(() => renderNode(opt.next), 700);
    }, 300);
  } else {
    setTimeout(() => renderNode(opt.next), 400);
  }
}
