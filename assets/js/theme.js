/* ============================================================
   THEME.JS — Dark / Light Mode Toggle
   VitalCheck — BMI & Health Calculator

   Dark mode is the default. Saves to localStorage.
   ============================================================ */

'use strict';

const themeIconEl = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vc_theme', theme);
  themeIconEl.textContent = theme === 'dark' ? '☀' : '☽';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const saved      = localStorage.getItem('vc_theme');
  const prefLight  = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefLight ? 'light' : 'dark'));
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);
