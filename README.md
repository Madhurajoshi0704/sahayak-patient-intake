# Sahayak — Patient Case-Taking Software (prototype)

A clickable prototype for **SIH Problem Statement — "Patient Case-Taking
Software"** (AIIA / Ministry of Ayush). It walks through the full patient
journey described in the problem statement:

1. **Identify** — language choice, ABHA ID / first-visit, consent
2. **Converse** — an adaptive voice/touch history interview, with red-flag detection
3. **Scan** — digitising old prescriptions and lab reports
4. **Summarize & Route** — compiling everything into one structured record
5. **Consult** — the doctor's screen: a ready-made summary they can edit and confirm

No backend, no build step — it's plain HTML/CSS/JS, so you can open it
directly in a browser or publish it for free with GitHub Pages.

## Try it

Just open `index.html` in a browser. Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Sahayak prototype"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Then in the repo's **Settings → Pages**, set the source to the `main`
branch, root folder. Your prototype will be live at
`https://<your-username>.github.io/<repo-name>/`.

## File structure — what each file does

```
sahayak-patient-intake/
├── index.html         All screen markup (both the patient kiosk and the
│                       doctor console live in this one page; JS shows/hides
│                       them). No logic lives here — just structure and text.
├── css/
│   └── style.css       All visual styling. Deliberately plain: large text,
│                       high contrast, a single blue accent colour, no
│                       animation beyond simple fades — built for people who
│                       don't use websites often (elderly, rural, first-time,
│                       low-literacy patients).
└── js/
    ├── state.js         Shared data: the current patient's answers, the
    │                    list of languages, the Step 2 question script,
    │                    and the two sample documents used in Step 3.
    │                    Change the data here to change what the demo shows.
    ├── ui.js             Small helper that switches between screens and
    │                    updates the "Step X of 5" indicator at the top.
    ├── identify.js       Step 1 logic: language picking, ABHA/first-visit
    │                    toggle, and unlocking "Continue" only once an
    │                    ID/name is entered and consent is ticked.
    ├── converse.js       Step 2 logic: a small state machine that walks
    │                    the question tree in state.js — shows a question,
    │                    waits for an answer, decides the next question,
    │                    and raises the red-flag banner when needed.
    ├── scan.js           Step 3 logic: simulates scanning a document —
    │                    shows a short "reading…" pause, then reveals the
    │                    fields a real OCR/document-AI service would
    │                    have extracted, with abnormal values flagged.
    ├── summary.js        Step 4 logic: an animated checklist standing in
    │                    for the real backend steps (AI summarisation,
    │                    FHIR push to the hospital system, ABHA linking).
    ├── doctor.js         Step 5 logic — the doctor's console. Builds the
    │                    structured summary from whatever the patient said
    │                    and scanned, tags every section with where it
    │                    came from, and handles editing/confirming.
    └── main.js           Wires everything together on page load, plus the
                         "Start over" reset used between demo runs.
```

## How data flows through the app

Everything the patient does gets written into one shared object, `state`
(defined in `js/state.js`):

- Step 2 answers go into `state.answers` (e.g. `state.answers.since = "Since today"`)
- A triggered red flag sets `state.redFlag = true`
- Scanned documents get pushed into `state.docs`

`js/doctor.js` reads that same `state` object and turns it into the
sections shown on the doctor's screen — so whatever the patient answered in
Step 2 and whatever was "scanned" in Step 3 is exactly what the doctor sees
in Step 5. That link is worth pointing out in a live demo: it shows the
pipeline genuinely carries data through, even though the AI itself
(speech recognition, OCR, summarisation) is simulated rather than real.

## What's simulated vs. what a real build needs

This prototype fakes the AI parts so it can run entirely in the browser
with no server or API keys. To turn it into a real product, the following
would each replace a piece of simulated logic:

| Simulated here | Would be replaced by |
|---|---|
| Fixed question tree in `state.js` | An LLM-driven dialogue manager constrained by a clinical-history ontology |
| Typed answer buttons | Real speech recognition (e.g. Bhashini / AI4Bharat ASR) for Indian languages |
| `mockDocs` fixed fields in `scan.js` | A real OCR + document-AI pipeline for handwritten/printed medical documents |
| Template sentences in `doctor.js` | An LLM summarisation call structuring the history into standard clinical format |
| The checklist in `summary.js` | Real API calls: FHIR push to the hospital's HIS, ABHA record linking |
| Everything running in the browser | A secure backend handling consent, storage, and the Digital Personal Data Protection Act 2023 / ABDM consent framework |

## Design choices for the target users

The problem statement's OPD population is largely elderly, rural, and
often visiting a hospital kiosk for the first time. The interface reflects
that on purpose:

- Large text (18px body, big buttons) and high-contrast colours
- Full-width, stacked answer buttons instead of small tappable chips
- One plain accent colour (blue) instead of multiple decorative accents
- No hover-only interactions, glowing/pulsing effects, or motion that
  doesn't respond to something the user did
- Plain language throughout ("Tell us what's wrong" rather than "Chief
  Complaint Capture")
