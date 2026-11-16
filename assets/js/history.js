/* ============================================================
   HISTORY.JS — BMI Calculation History
   VitalCheck — BMI & Health Calculator

   Saves past BMI calculations to localStorage.
   Lets users track changes over time.
   ============================================================ */

'use strict';

/* Saved entries are checked before use, so a broken or edited save
   can't break the page or put unexpected HTML on it. */
function cleanHistory(saved) {
  if (!Array.isArray(saved)) return [];
  const num = (v, min, max) => { const n = Number(v); return Number.isFinite(n) && n >= min && n <= max ? n : null; };
  return saved
    .map((e, i) => e && typeof e === 'object' && {
      id:     num(e.id, 0, 1e15) ?? i,
      bmi:    num(e.bmi, 5, 100),
      weight: num(e.weight, 1, 500),
      height: num(e.height, 50, 280),
      age:    num(e.age, 1, 120),
      gender: e.gender === 'female' ? 'female' : 'male',
      date:   String(e.date || '').replace(/[^0-9A-Za-z ,\-/]/g, '').slice(0, 20)
    })
    .filter(e => e && e.bmi !== null && e.weight !== null && e.height !== null)
    .slice(0, 10);
}

let bmiHistory = cleanHistory(loadFromStorage('vc_history', []));

const historyListEl = document.getElementById('historyList');

/* ── Save a result to history ───────────────────────────── */

/**
 * Save the last calculation result to history.
 * Called by app.js after a successful calculation.
 * Keeps the last 10 entries only.
 */
function saveToHistory() {
  if (!lastResult) return;

  bmiHistory.unshift({
    id:     Date.now(),
    bmi:    lastResult.bmi,
    weight: lastResult.weightKg,
    height: lastResult.heightCm,
    age:    lastResult.age,
    gender: lastResult.gender,
    date:   lastResult.date
  });

  // Keep only the last 10 entries
  bmiHistory = bmiHistory.slice(0, 10);
  saveToStorage('vc_history', bmiHistory);
  renderHistory();
}

/* ── Delete a history entry ─────────────────────────────── */
function deleteHistoryEntry(id) {
  bmiHistory = bmiHistory.filter(e => e.id !== id);
  saveToStorage('vc_history', bmiHistory);
  renderHistory();
}

/* ── Clear all history ──────────────────────────────────── */
function clearHistory() {
  bmiHistory = [];
  saveToStorage('vc_history', bmiHistory);
  renderHistory();
}

/* ── Render ─────────────────────────────────────────────── */
function renderHistory() {
  historyListEl.innerHTML = '';

  if (!bmiHistory.length) {
    historyListEl.innerHTML = '<div class="history-empty" role="listitem">No history yet. Calculate your BMI to start tracking.</div>';
    renderChart();
    return;
  }

  bmiHistory.forEach(entry => {
    // The category (label and colour) always comes from the current cut-offs
    const range = getBMIRange(entry.bmi);
    const div = document.createElement('div');
    div.className = 'history-item';
    div.setAttribute('role', 'listitem');
    div.innerHTML = `
      <div class="history-item__bmi">${entry.bmi}</div>
      <div class="history-item__info">
        <div class="history-item__status">${escapeHtml(range.label)}</div>
        <div class="history-item__meta">${entry.weight}kg · ${entry.height}cm · Age ${entry.age ?? '–'} · ${escapeHtml(entry.date)}</div>
      </div>
      <button class="history-item__del" data-id="${entry.id}" aria-label="Delete entry from ${escapeHtml(entry.date)}">✕</button>
    `;
    div.querySelector('.history-item__bmi').style.color = range.color;
    div.querySelector('.history-item__status').style.color = range.color;
    historyListEl.appendChild(div);
  });
  renderChart();
}

/* ── Trend chart (2 or more saved results) ──────────────── */
const chartEl = document.getElementById('historyChart');
const SVG_NS  = 'http://www.w3.org/2000/svg';

/** Make an SVG element with attributes (no inline styles). */
function svgEl(tag, attrs, text) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text !== undefined) el.textContent = text;
  return el;
}

function renderChart() {
  const points = bmiHistory.slice().reverse();   // oldest → newest
  chartEl.textContent = '';
  if (points.length < 2) { chartEl.hidden = true; return; }
  chartEl.hidden = false;

  // Drawn at the real on-screen width, so the text stays a normal size
  const W = Math.max(280, Math.round(chartEl.clientWidth || 600)), H = 180, padX = 34, top = 24, bottom = 30;
  const normal = activeRanges().find(r => r.id === 'normal');
  const values = points.map(p => p.bmi);
  const lo = Math.floor(Math.min(...values, normal.min) - 1);
  const hi = Math.ceil(Math.max(...values, normal.max) + 1);
  const x = i => padX + (i * (W - padX * 2)) / (points.length - 1);
  const y = v => top + ((hi - v) * (H - top - bottom)) / (hi - lo);

  const first = points[0], last = points[points.length - 1];
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `BMI trend: ${first.bmi} on ${first.date} to ${last.bmi} on ${last.date}` });
  // Healthy band
  svg.appendChild(svgEl('rect', { class: 'history-chart__band', x: padX, width: W - padX * 2, y: y(normal.max), height: y(normal.min) - y(normal.max), rx: 4 }));
  svg.appendChild(svgEl('text', { class: 'history-chart__band-label', x: padX + 6, y: y(normal.max) + 12 }, 'Healthy range'));
  svg.appendChild(svgEl('line', { class: 'history-chart__axis', x1: padX, x2: W - padX, y1: H - bottom, y2: H - bottom }));
  // Line and points
  svg.appendChild(svgEl('polyline', { class: 'history-chart__line', points: points.map((p, i) => `${x(i)},${y(p.bmi)}`).join(' ') }));
  points.forEach((p, i) => {
    svg.appendChild(svgEl('circle', { class: 'history-chart__dot', cx: x(i), cy: y(p.bmi), r: 4.5 }));
    svg.appendChild(svgEl('text', { class: 'history-chart__value', x: x(i), y: y(p.bmi) - 10, 'text-anchor': 'middle' }, String(p.bmi)));
    if (i === 0 || i === points.length - 1 || points.length <= 5) {
      svg.appendChild(svgEl('text', { class: 'history-chart__date', x: x(i), y: H - 10, 'text-anchor': i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle' }, p.date));
    }
  });
  chartEl.appendChild(svg);
}

// Redraw when the window size changes
let chartResize = 0;
window.addEventListener('resize', () => { clearTimeout(chartResize); chartResize = setTimeout(renderChart, 150); });

/* ── Event Listeners ────────────────────────────────────── */

// Delete individual entry
historyListEl.addEventListener('click', e => {
  const delBtn = e.target.closest('.history-item__del');
  if (delBtn) {
    deleteHistoryEntry(Number(delBtn.dataset.id));
    showToast('Entry deleted.');
  }
});

// Clear all history button
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  if (!bmiHistory.length) return;
  clearHistory();
  showToast('History cleared.');
});
