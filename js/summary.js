// summary.js - Automated HIS & ABDM Integration Simulation

function runSummaryAnimation() {
  const checks = [
    { id: 'check-1', text: '✅ Formatted Chief Complaints & HPI Summary' },
    { id: 'check-2', text: '✅ Standardized ICD-11 & SNOMED CT Ontology' },
    { id: 'check-3', text: '✅ Pushed FHIR Bundle to Hospital Information System' },
    { id: 'check-4', text: '✅ Linked Session Record to ABHA PHR Account' }
  ];

  checks.forEach((item, index) => {
    setTimeout(() => {
      document.getElementById(item.id).innerText = item.text;
      if (index === checks.length - 1) {
        document.getElementById('btn-goto-doctor').classList.remove('hidden');
      }
    }, (index + 1) * 800);
  });
}
