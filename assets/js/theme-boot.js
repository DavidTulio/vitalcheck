/* ============================================================
   THEME-BOOT.JS — Applies the saved theme before first paint
   VitalCheck — BMI & Health Calculator

   Loaded in <head> so the page never flashes the wrong theme.
   Kept in its own file so the security policy can block all
   inline scripts. Dark is the default.
   ============================================================ */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('vc_theme'); } catch (e) { /* storage blocked */ }
  var light = window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.setAttribute('data-theme', saved === 'dark' || saved === 'light' ? saved : (light ? 'light' : 'dark'));
})();
