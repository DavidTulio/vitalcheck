/* ============================================================
   APP.JS — Form Interactions, Unit Toggles, Toast & Init
   VitalCheck — BMI & Health Calculator

   Handles:
   - Gender button selection
   - Unit toggle (kg/lbs, cm/ft)
   - Height input switching (cm single field vs ft+in fields)
   - Age slider interaction
   - Calculate button
   - Save to history button
   - Toast notifications
   ============================================================ */

'use strict';

/* ── Toast ──────────────────────────────────────────────── */
const toastEl = document.getElementById('toast');
let toastTimer = null;

/**
 * Show a brief notification.
 * @param {string} message
 * @param {'success'|'warning'|'danger'} type
 */
function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className   = `toast show ${type}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

/* ── Gender Buttons ─────────────────────────────────────── */
document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Age Slider ─────────────────────────────────────────── */
const ageSlider  = document.getElementById('ageSlider');
const ageDisplay = document.getElementById('ageDisplay');

ageSlider.addEventListener('input', () => {
  ageDisplay.textContent = ageSlider.value;
});

/* ── Unit Toggle: Weight (kg / lbs) ────────────────────── */
document.querySelectorAll('.unit-btn[data-unit-group="weight"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.unit-btn[data-unit-group="weight"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const weightInput = document.getElementById('weightInput');
    const currentVal  = parseFloat(weightInput.value);
    const unitLabel   = document.getElementById('weightUnit');

    if (btn.dataset.unit === 'lbs' && currentVal) {
      weightInput.value     = kgToLbs(currentVal);
      weightInput.placeholder = 'e.g. 132';
      if (unitLabel) unitLabel.textContent = 'lbs';
    } else if (btn.dataset.unit === 'kg' && currentVal) {
      weightInput.value     = lbsToKg(currentVal);
      weightInput.placeholder = 'e.g. 60';
      if (unitLabel) unitLabel.textContent = 'kg';
    } else {
      weightInput.placeholder = btn.dataset.unit === 'kg' ? 'e.g. 60' : 'e.g. 132';
      if (unitLabel) unitLabel.textContent = btn.dataset.unit;
    }
  });
});

/* ── Unit Toggle: Height (cm / ft) ─────────────────────── */
const heightCmWrap = document.getElementById('heightCmWrap');
const heightFtWrap = document.getElementById('heightFtWrap');

document.querySelectorAll('.unit-btn[data-unit-group="height"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.unit-btn[data-unit-group="height"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.unit === 'ft') {
      heightCmWrap.style.display = 'none';
      heightFtWrap.style.display = 'grid';
    } else {
      heightCmWrap.style.display = 'block';
      heightFtWrap.style.display = 'none';
    }
  });
});

/* ── Calculate Button ───────────────────────────────────── */
document.getElementById('calculateBtn').addEventListener('click', () => {
  calculate();
});

// Also allow Enter key in any input to trigger calculate
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') calculate();
  });
});

/* ── Save to History Button ─────────────────────────────── */
document.getElementById('saveHistoryBtn').addEventListener('click', () => {
  if (!lastResult) {
    showToast('Calculate your BMI first.', 'warning');
    return;
  }
  saveToHistory();
  showToast('✓ Result saved to history!');
});

/* ── Disclaimer Toggle ──────────────────────────────────── */
const disclaimerBtn     = document.getElementById('disclaimerToggle');
const disclaimerContent = document.getElementById('disclaimerContent');

if (disclaimerBtn) {
  disclaimerBtn.addEventListener('click', () => {
    const isOpen = disclaimerContent.style.display !== 'none';
    disclaimerContent.style.display = isOpen ? 'none' : 'block';
    disclaimerBtn.textContent       = isOpen ? '▼ Show disclaimer' : '▲ Hide disclaimer';
  });
}

/* ── App Initialisation ─────────────────────────────────── */
function initApp() {
  initTheme();
  renderHistory();

  // Set male as default selected gender
  document.querySelector('.gender-btn[data-gender="male"]')?.classList.add('active');

  // Set default unit buttons active
  document.querySelector('.unit-btn[data-unit-group="weight"][data-unit="kg"]')?.classList.add('active');
  document.querySelector('.unit-btn[data-unit-group="height"][data-unit="cm"]')?.classList.add('active');

  // Hide ft/in fields by default
  if (heightFtWrap) heightFtWrap.style.display = 'none';
}

initApp();
