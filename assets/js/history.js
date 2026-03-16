/* ============================================================
   HISTORY.JS — BMI Calculation History
   VitalCheck — BMI & Health Calculator

   Saves past BMI calculations to localStorage.
   Lets users track changes over time.
   ============================================================ */

'use strict';

let bmiHistory = loadFromStorage('vc_history', []);

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
    status: lastResult.range.label,
    color:  lastResult.range.color,
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
    historyListEl.innerHTML = '<div class="history-empty">No history yet. Calculate your BMI to start tracking.</div>';
    return;
  }

  bmiHistory.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-item__bmi" style="color:${entry.color}">${entry.bmi}</div>
      <div class="history-item__info">
        <div class="history-item__status" style="color:${entry.color}">${entry.status}</div>
        <div class="history-item__meta">${entry.weight}kg · ${entry.height}cm · Age ${entry.age} · ${entry.date}</div>
      </div>
      <button class="history-item__del" data-id="${entry.id}" aria-label="Delete entry">✕</button>
    `;
    historyListEl.appendChild(div);
  });
}

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
