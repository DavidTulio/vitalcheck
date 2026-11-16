/* ============================================================
   CALCULATOR.JS — BMI Calculation & Result Rendering
   VitalCheck — BMI & Health Calculator

   Handles:
   - Reading form inputs (height, weight, age, gender, units)
   - Calculating BMI
   - Rendering the result card, gauge, quick stats
   - Rendering health tips
   - Rendering the BMI reference table
   ============================================================ */

'use strict';

/* ── Last Result ─────────────────────────────────────────── */
// Stored so history.js can access it after calculation
let lastResult = null;

/* ── DOM References ─────────────────────────────────────── */
const resultsEmptyEl  = document.getElementById('resultsEmpty');
const resultsContentEl = document.getElementById('resultsContent');
const bmiNumberEl     = document.getElementById('bmiNumber');
const bmiStatusEl     = document.getElementById('bmiStatus');
const bmiNeedleEl     = document.getElementById('bmiNeedle');
const quickStatsEl    = document.getElementById('quickStats');
const healthyRangeEl  = document.getElementById('healthyRange');
const tipsListEl      = document.getElementById('tipsList');
const bmiTableBodyEl  = document.getElementById('bmiTableBody');

/* ── Main Calculate Function ────────────────────────────── */

/**
 * Read all form inputs, compute BMI, and render the results.
 * Called by app.js when the Calculate button is clicked.
 */
function calculate() {
  // Read inputs
  const gender     = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
  const age        = parseInt(document.getElementById('ageSlider').value);
  const weightUnit = document.querySelector('.unit-btn.active[data-unit-group="weight"]')?.dataset.unit || 'kg';
  const heightUnit = document.querySelector('.unit-btn.active[data-unit-group="height"]')?.dataset.unit || 'cm';

  let weightKg, heightCm;

  // Convert to metric if needed
  if (weightUnit === 'kg') {
    weightKg = parseFloat(document.getElementById('weightInput').value);
  } else {
    weightKg = lbsToKg(parseFloat(document.getElementById('weightInput').value));
  }

  if (heightUnit === 'cm') {
    heightCm = parseFloat(document.getElementById('heightInput').value);
  } else {
    // Height in feet format: stored as total inches
    const ft      = parseFloat(document.getElementById('heightFt').value) || 0;
    const inches  = parseFloat(document.getElementById('heightIn').value) || 0;
    heightCm      = ftToCm(ft, inches);
  }

  // Validate
  if (!weightKg || weightKg <= 0 || weightKg > 500) {
    showToast('Please enter a valid weight.', 'warning');
    return;
  }
  if (!heightCm || heightCm < 50 || heightCm > 280) {
    showToast('Please enter a valid height.', 'warning');
    return;
  }

  // Calculate
  const bmi      = calculateBMI(weightKg, heightCm);
  const range    = getBMIRange(bmi);
  const healthy  = getHealthyWeightRange(heightCm);

  // Store result for history
  lastResult = { bmi, range, weightKg, heightCm, age, gender, date: today() };

  // Render everything
  renderResult(bmi, range, weightKg, heightCm, age, gender, healthy);
}

/* ── Render Result ──────────────────────────────────────── */

function renderResult(bmi, range, weightKg, heightCm, age, gender, healthy) {
  // Show results panel, hide empty state
  resultsEmptyEl.style.display   = 'none';
  resultsContentEl.style.display = 'flex';

  // Set CSS variables for dynamic color theming
  const card = document.getElementById('bmiResultCard');
  card.style.setProperty('--result-color', range.color);
  card.style.setProperty('--result-dim',   range.dim);
  card.style.setProperty('--result-glow',  range.dim);

  // BMI number with animation
  animateNumber(bmiNumberEl, bmi);
  bmiNumberEl.style.color = range.color;

  // Status badge
  bmiStatusEl.textContent = range.emoji + ' ' + range.label;
  bmiStatusEl.style.color       = range.color;
  bmiStatusEl.style.borderColor = range.color;
  bmiStatusEl.style.background  = range.dim;

  // Gauge colours follow the categories in use (WHO or Asian),
  // placed with the same scale as the needle
  const edge = v => (v <= 0 ? 0 : v >= 999 ? 100 : ((v - 10) / 35) * 100);
  document.querySelector('.bmi-gauge__bar').style.background =
    'linear-gradient(to right, ' + activeRanges().map(r => `${r.color} ${edge(r.min)}% ${edge(r.max)}%`).join(', ') + ')';

  // Gauge needle position
  const gaugePct = getBMIGaugePosition(bmi);
  bmiNeedleEl.style.left  = gaugePct + '%';
  bmiNeedleEl.style.borderColor = range.color;

  // Quick stats
  const heightM = heightCm / 100;
  quickStatsEl.innerHTML = `
    <div class="quick-stat">
      <div class="quick-stat__value">${weightKg.toFixed(1)}<span class="quick-stat__unit"> kg</span></div>
      <div class="quick-stat__label">Weight</div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat__value">${heightCm}<span class="quick-stat__unit"> cm</span></div>
      <div class="quick-stat__label">Height</div>
    </div>
    <div class="quick-stat">
      <div class="quick-stat__value">${age}</div>
      <div class="quick-stat__label">Age</div>
    </div>
  `;

  // Healthy weight range
  healthyRangeEl.innerHTML = `
    <div class="healthy-range__title">Healthy Weight Range for Your Height</div>
    <div class="healthy-range__values">
      <span class="healthy-range__value">${healthy.min}</span>
      <span class="healthy-range__sep">–</span>
      <span class="healthy-range__value">${healthy.max}</span>
      <span class="healthy-range__unit">kg</span>
    </div>
    <div class="healthy-range__sub">Based on BMI ${healthy.bmiMin}–${healthy.bmiMax} for ${heightCm} cm height</div>
  `;

  // Health tips
  renderTips(range.id);

  // BMI reference table
  renderBMITable(range.id);

  // Phones: the result is below the form — bring it into view
  if (window.matchMedia('(max-width: 860px)').matches) {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('resultsPanel').scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }
}

/* ── Animated Number Counter ────────────────────────────── */
function animateNumber(el, target) {
  const start    = parseFloat(el.textContent) || 0;
  const duration = 600;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = (start + (target - start) * eased).toFixed(1);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ── Health Tips ────────────────────────────────────────── */
function renderTips(categoryId) {
  const tips = HEALTH_TIPS[categoryId] || HEALTH_TIPS.normal;
  tipsListEl.innerHTML = '';
  tips.forEach(tip => {
    const div = document.createElement('div');
    div.className = 'tip-item';
    div.innerHTML = `
      <span class="tip-item__icon" aria-hidden="true">${tip.icon}</span>
      <p class="tip-item__text">${tip.text}</p>
    `;
    tipsListEl.appendChild(div);
  });
}

/* ── BMI Reference Table ────────────────────────────────── */
function renderBMITable(activeCategoryId) {
  bmiTableBodyEl.innerHTML = '';
  activeRanges().forEach(range => {
    const tr = document.createElement('tr');
    if (range.id === activeCategoryId) tr.className = 'active-row';
    const rangeLabel = range.min === 0 ? '< ' + range.max : range.max >= 999 ? range.min + '+' : range.min + ' – < ' + range.max;
    tr.innerHTML = `
      <td>
        <span class="bmi-table__dot"></span>
        ${range.label}
      </td>
      <td>${rangeLabel}</td>
      <td class="bmi-table__you">${range.id === activeCategoryId ? '← You' : ''}</td>
    `;
    // Colours are set through the style object (allowed by the security policy)
    tr.querySelector('.bmi-table__dot').style.background = range.color;
    tr.querySelector('.bmi-table__you').style.color = range.color;
    bmiTableBodyEl.appendChild(tr);
  });
}
