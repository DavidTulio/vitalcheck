/* ============================================================
   CONFIG.JS — BMI Ranges, Health Tips & Storage Helpers
   VitalCheck — BMI & Health Calculator

   Contains:
   - BMI classification ranges (WHO standard)
   - Health tips per BMI category
   - Storage helper functions
   - Number formatting utilities

   TO CUSTOMIZE:
   - Add more tips per category in the HEALTH_TIPS object
   - Adjust BMI ranges if needed (WHO vs Asian standards differ)
   ============================================================ */

'use strict';

/* ── BMI Classifications (WHO Standard) ─────────────────────
   Asian populations use slightly different cutoffs:
   Overweight starts at 23 instead of 25.
   The app uses WHO standard but you can adjust below.
   ---------------------------------------------------------- */
const BMI_RANGES = [
  {
    id:      'underweight',
    label:   'Underweight',
    min:     0,
    max:     18.5,
    color:   'var(--status-under)',
    dim:     'var(--status-under-dim)',
    gaugeEnd: 22,   // % position on the gauge bar
    emoji:   '🔵'
  },
  {
    id:      'normal',
    label:   'Normal Weight',
    min:     18.5,
    max:     25,
    color:   'var(--status-normal)',
    dim:     'var(--status-normal-dim)',
    gaugeEnd: 43,
    emoji:   '🟢'
  },
  {
    id:      'overweight',
    label:   'Overweight',
    min:     25,
    max:     30,
    color:   'var(--status-over)',
    dim:     'var(--status-over-dim)',
    gaugeEnd: 55,
    emoji:   '🟡'
  },
  {
    id:      'obese1',
    label:   'Obese Class I',
    min:     30,
    max:     35,
    color:   'var(--status-obese1)',
    dim:     'var(--status-obese-dim)',
    gaugeEnd: 70,
    emoji:   '🟠'
  },
  {
    id:      'obese2',
    label:   'Obese Class II',
    min:     35,
    max:     40,
    color:   'var(--status-obese2)',
    dim:     'var(--status-obese-dim)',
    gaugeEnd: 85,
    emoji:   '🔴'
  },
  {
    id:      'obese3',
    label:   'Obese Class III',
    min:     40,
    max:     999,
    color:   'var(--status-obese3)',
    dim:     'var(--status-obese-dim)',
    gaugeEnd: 100,
    emoji:   '🔴'
  }
];

/* ── Health Tips per BMI Category ───────────────────────────
   Each category has 4 tips shown after calculation.
   TO ADD MORE: just add more objects to any array below.
   ---------------------------------------------------------- */
const HEALTH_TIPS = {
  underweight: [
    { icon: '🍽️', text: '<strong>Eat more frequently.</strong> Try 5–6 smaller meals a day instead of 3 large ones to increase calorie intake.' },
    { icon: '🥩', text: '<strong>Prioritize protein.</strong> Include eggs, chicken, fish, beans, and nuts in every meal to support muscle growth.' },
    { icon: '🏋️', text: '<strong>Do strength training.</strong> Light resistance exercises help build muscle mass, not just body fat.' },
    { icon: '🩺', text: '<strong>See a doctor.</strong> Being underweight can have underlying causes. A check-up is recommended.' }
  ],
  normal: [
    { icon: '✅', text: '<strong>Great work!</strong> Your BMI is in the healthy range. Focus on maintaining this with balanced habits.' },
    { icon: '🥗', text: '<strong>Keep eating balanced.</strong> Aim for fruits, vegetables, lean protein, and whole grains daily.' },
    { icon: '🏃', text: '<strong>Stay active.</strong> At least 150 minutes of moderate exercise per week keeps your weight stable.' },
    { icon: '💧', text: '<strong>Stay hydrated.</strong> Drink at least 8 glasses of water a day to support metabolism.' }
  ],
  overweight: [
    { icon: '🥦', text: '<strong>Add more vegetables.</strong> Fill half your plate with vegetables to reduce calories without feeling hungry.' },
    { icon: '🚶', text: '<strong>Start with walking.</strong> A 30-minute brisk walk daily is one of the most effective ways to lose weight.' },
    { icon: '🚫', text: '<strong>Reduce sugary drinks.</strong> Replacing soda and juice with water can cut hundreds of calories per day.' },
    { icon: '😴', text: '<strong>Prioritize sleep.</strong> Poor sleep increases hunger hormones. Aim for 7–9 hours every night.' }
  ],
  obese1: [
    { icon: '🩺', text: '<strong>Consult a doctor.</strong> A healthcare professional can create a safe, personalized weight loss plan for you.' },
    { icon: '📉', text: '<strong>Aim for gradual loss.</strong> Losing 0.5–1 kg per week is safe and sustainable.' },
    { icon: '🍽️', text: '<strong>Watch portion sizes.</strong> Use smaller plates and avoid eating directly from packaging.' },
    { icon: '🏊', text: '<strong>Try low-impact exercise.</strong> Swimming, cycling, or water aerobics are gentle on joints.' }
  ],
  obese2: [
    { icon: '🩺', text: '<strong>Medical supervision recommended.</strong> Please consult a doctor before starting any diet or exercise program.' },
    { icon: '📋', text: '<strong>Track your food intake.</strong> A food diary helps identify patterns and areas for improvement.' },
    { icon: '🤝', text: '<strong>Seek support.</strong> Joining a support group or working with a dietitian greatly improves success rates.' },
    { icon: '💊', text: '<strong>Ask about medical options.</strong> A doctor may discuss medications or other interventions if appropriate.' }
  ],
  obese3: [
    { icon: '🚨', text: '<strong>Please seek medical help.</strong> Severe obesity carries serious health risks. A doctor\'s guidance is essential.' },
    { icon: '🏥', text: '<strong>Explore all options.</strong> Structured medical programs, surgery, and specialist care may be discussed.' },
    { icon: '❤️', text: '<strong>Be kind to yourself.</strong> Change is a journey. Small improvements each day add up over time.' },
    { icon: '🤝', text: '<strong>You are not alone.</strong> Healthcare teams are there to support, not judge. Reach out today.' }
  ]
};

/* ── BMI Utility Functions ──────────────────────────────── */

/**
 * Calculate BMI from weight (kg) and height (cm).
 * Formula: weight(kg) / height(m)²
 * @returns {number} BMI value rounded to 1 decimal
 */
function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/* ── Asian cut-offs ─────────────────────────────────────────
   WHO Asia-Pacific guidance (2000): risk starts at lower BMI for
   Asian adults. Overweight from 23, obese from 25 (class I) and
   30 (class II). Chosen with the WHO / Asian switch.
   ---------------------------------------------------------- */
const ASIAN_CUTOFFS = {
  underweight: [0, 18.5],
  normal:      [18.5, 23],
  overweight:  [23, 25],
  obese1:      [25, 30],
  obese2:      [30, 999]
};

/** 'who' or 'asian' — remembered between visits */
let bmiScale = (function () {
  try { return localStorage.getItem('vc_scale') === 'asian' ? 'asian' : 'who'; } catch (e) { return 'who'; }
})();

/** The BMI categories in use right now (WHO or Asian cut-offs). */
function activeRanges() {
  if (bmiScale !== 'asian') return BMI_RANGES;
  return BMI_RANGES
    .filter(r => ASIAN_CUTOFFS[r.id])
    .map(r => ({
      ...r,
      min:   ASIAN_CUTOFFS[r.id][0],
      max:   ASIAN_CUTOFFS[r.id][1],
      label: r.id === 'overweight' ? 'Overweight (at risk)' : r.label
    }));
}

/**
 * Get the BMI range object for a given BMI value.
 * @param {number} bmi
 * @returns {object} BMI range object from BMI_RANGES
 */
function getBMIRange(bmi) {
  const ranges = activeRanges();
  return ranges.find(r => bmi >= r.min && bmi < r.max) || ranges[ranges.length - 1];
}

/**
 * Calculate healthy weight range for a given height.
 * Normal BMI is 18.5–24.9.
 * @param {number} heightCm
 * @returns {{ min: number, max: number }} in kg
 */
function getHealthyWeightRange(heightCm) {
  const h = heightCm / 100;
  const normal = activeRanges().find(r => r.id === 'normal');
  const top = Math.round((normal.max - 0.1) * 10) / 10;   // 24.9 (WHO) or 22.9 (Asian)
  return {
    min: Math.round(normal.min * h * h * 10) / 10,
    max: Math.round(top * h * h * 10) / 10,
    bmiMin: normal.min,
    bmiMax: top
  };
}

/**
 * Calculate the needle position (%) on the gauge bar.
 * Maps BMI value to a 0–100% position.
 * Range mapped: BMI 10 = 0%, BMI 45 = 100%
 * @param {number} bmi
 * @returns {number} percentage 0–100
 */
function getBMIGaugePosition(bmi) {
  const min = 10, max = 45;
  return Math.min(Math.max(((bmi - min) / (max - min)) * 100, 2), 98);
}

/**
 * Convert lbs to kg.
 */
function lbsToKg(lbs)  { return Math.round(lbs * 0.453592 * 10) / 10; }

/**
 * Convert kg to lbs.
 */
function kgToLbs(kg)   { return Math.round(kg * 2.20462 * 10) / 10; }

/**
 * Convert feet+inches to cm.
 */
function ftToCm(ft, inches) { return Math.round((ft * 30.48) + (inches * 2.54)); }

/**
 * Convert cm to feet and inches.
 */
function cmToFt(cm) {
  const totalInches = cm / 2.54;
  return { ft: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) };
}

/* ── Storage Helpers ────────────────────────────────────── */

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch (e) { return fallback; }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function today() {
  return new Date().toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}
