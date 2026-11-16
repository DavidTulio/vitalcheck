# VitalCheck — BMI & Health Calculator

A modern BMI and health calculator with deep blue/navy design, animated gauge,
personalized health tips, and history tracking.

**Built by:** David John Emmanuel G. Tulio
**Live Demo:** https://bmi-vitalcheck.netlify.app

---

## 🎯 What It Does

VitalCheck calculates your Body Mass Index (BMI) based on your height and weight,
shows your health classification on an animated gauge, provides personalized health
tips based on your result, and tracks your history over time.

---

## ✨ Features

- **BMI Calculator** — supports metric (kg/cm) and imperial (lbs/ft+in) units
- **Gender & Age Input** — age via a smooth slider (5–100 years)
- **Animated BMI Gauge** — color-coded scale bar with a needle that moves to your result
- **Animated BMI Number** — smooth number count-up animation on result
- **6 BMI Categories** — Underweight, Normal, Overweight, Obese I, II, III (WHO standard)
- **Dynamic Color Theming** — result card color changes based on your BMI category
- **Healthy Weight Range** — shows your ideal weight range for your height
- **4 Personalized Health Tips** — different tips per BMI category
- **BMI Reference Table** — shows all categories, highlights your current one
- **History Tracking** — save up to 10 past results, delete individual entries, and see a **trend chart** against the healthy range
- **WHO or Asian cut-offs** — one switch for the lower cut-offs recommended for Asian adults (WHO Asia-Pacific); the gauge, table, tips and healthy range all follow it
- **Phones** — the page scrolls to your result after you calculate
- **Dark / Light Mode** — dark navy by default, saves preference
- **Fully Responsive** — works on mobile and desktop
- **Medical Disclaimer** — collapsible disclaimer reminding users BMI is a screening tool

---

## 🔒 Security & speed

- Strict security headers in `_headers` (read by Netlify): no inline scripts or styles, no outside requests, can’t be framed by other sites
- Saved history is checked before it is shown, and everything shown is escaped
- The font is served from `assets/fonts/` instead of Google Fonts
- Lighthouse (phone): Performance 98 · Accessibility 100 · Best practices 100 · SEO 100

---

## 📁 File Structure

```
bmi_calculator/
├── index.html              ← HTML structure only
├── README.md
└── assets/
    ├── css/
    │   ├── tokens.css      ← Colors, fonts, BMI status colors
    │   ├── base.css        ← Reset, buttons, form elements
    │   ├── layout.css      ← Header, hero, grid, input panel
    │   └── results.css     ← Gauge, cards, tips, history
    └── js/
        ├── config.js       ← BMI ranges, health tips, math helpers
        ├── calculator.js   ← BMI calculation and rendering
        ├── history.js      ← History save/load/render
        ├── theme.js        ← Dark/light mode
        └── app.js          ← UI events and app init
```

---

## 🔧 Customization

**Add more health tips** → `assets/js/config.js` (HEALTH_TIPS object)

**Use Asian BMI cutoffs** → `assets/js/config.js` (BMI_RANGES array)
```js
// Change overweight threshold from 25 to 23:
{ id: 'overweight', min: 23, max: 27.5, ... }
```

**Change accent color** → `assets/css/tokens.css`
```css
--accent: #your-color;
```

---

## 🚀 Deployment

```bash
git init
git add .
git commit -m "initial commit - VitalCheck BMI Calculator"
git branch -M main
git remote add origin https://github.com/DavidTulio/vitalcheck.git
git push -u origin main
```

---

## ⚕️ Disclaimer

BMI is a screening tool only. It does not account for muscle mass, bone density,
age, or fat distribution. Always consult a healthcare professional for medical advice.

---

## 🧠 Technologies

- HTML5, CSS3, JavaScript (Vanilla/ES6)
- No frameworks, no libraries, no dependencies
- Web Storage API (localStorage) for history persistence

---

&copy; 2025 David John Emmanuel G. Tulio
