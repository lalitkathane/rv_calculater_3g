/* RV Calculator — script.js (updated) */

let currentRoundFigure = 0;
// Load saved ledger state or initialize to empty array
let ledgerValues = JSON.parse(localStorage.getItem("ledger")) || [];

/* ---------- Theme handling ---------- */
(function initTheme() {
  const saved = localStorage.getItem('rv_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initial);

  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.setAttribute('aria-checked', initial === 'dark' ? 'true' : 'false');
    btn.classList.toggle('is-dark', initial === 'dark');

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleThemeMode();
      }
    });
    btn.addEventListener('click', toggleThemeMode);
  }

  // System theme changes dynamic listener (if user hasn't explicitly overridden theme)
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("rv_theme")) {
        const nextTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", nextTheme);
        if (btn) {
          btn.setAttribute('aria-checked', e.matches ? 'true' : 'false');
          btn.classList.toggle('is-dark', e.matches);
        }
      }
    });
  }
})();

function toggleThemeMode() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rv_theme', next);

  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
    btn.classList.toggle('is-dark', next === 'dark');
  }
}

/* ---------- Currency formatting ---------- */
function formatCurrency(amount, maxFractionDigits = 2) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: maxFractionDigits
  }).format(amount);
}

/* ---------- Calculator logic ---------- */
function calculateDiscount() {
  const originalEl = document.getElementById('originalPrice');
  const discountEl = document.getElementById('discountPercentage');

  const originalPrice = parseFloat(originalEl.value) || 0;
  let discountPercent = parseFloat(discountEl.value) || 0;

  // Clamp discount percentage between 0 and 100%
  if (discountPercent < 0 || discountPercent > 100) {
    discountPercent = Math.max(0, Math.min(100, discountPercent));
    discountEl.value = discountPercent;
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  // Ensure final price does not become negative
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  currentRoundFigure = Math.round(finalPrice);

  document.getElementById('discountAmount').innerText = formatCurrency(discountAmount);
  document.getElementById('finalPrice').innerText = formatCurrency(finalPrice);
  document.getElementById('roundFigure').innerText = formatCurrency(currentRoundFigure, 0);
}

/* ---------- Input helpers (placeholder UX) ---------- */
function clearPlaceholder(element, defaultValue) {
  const card = element.closest('.input-card');
  if (card) card.classList.add('focused-card');

  if (element.value === defaultValue || parseFloat(element.value) === 0) {
    element.value = '';
    return;
  }

  const cached = element.value;
  element.type = 'text';
  setTimeout(() => {
    try {
      element.setSelectionRange(cached.length, cached.length);
    } catch (e) {
      // ignore if not supported
    }
    element.type = 'number';
  }, 10);
}

function restorePlaceholder(element, defaultValue) {
  const card = element.closest('.input-card');
  if (card) card.classList.remove('focused-card');

  if (String(element.value).trim() === '') {
    element.value = defaultValue;
    calculateDiscount();
  }
}

/* ---------- Ledger functions ---------- */
function addToLedger() {
  if (currentRoundFigure <= 0) return;

  ledgerValues.push(currentRoundFigure);
  saveAndRenderLedger();

  const btn = document.querySelector('.add-ledger-btn');
  if (btn) {
    btn.classList.add('stamped');
    setTimeout(() => btn.classList.remove('stamped'), 180);
  }

  // Reset inputs to base zeros
  document.getElementById('originalPrice').value = '0.00';
  document.getElementById('discountPercentage').value = '0';
  calculateDiscount();
}

function renderLedger() {
  const container = document.getElementById('ledgerContainer');

  if (!container) return;

  if (ledgerValues.length === 0) {
    container.innerHTML = 'Stamp <strong>＋</strong> to add the round figure here.';
    container.classList.add('ledger-placeholder');
    return;
  }

  container.classList.remove('ledger-placeholder');

  const formulaString = ledgerValues.map(v => formatCurrency(v, 0)).join(' + ');
  const totalSum = ledgerValues.reduce((sum, val) => sum + val, 0);
  const formattedTotal = formatCurrency(totalSum, 0);

  container.innerHTML = `
    <div class="formula-container">
      <div class="formula-line">${formulaString}</div>
      <div class="total-line">Total: ${formattedTotal}</div>
    </div>
  `;
}

function saveAndRenderLedger() {
  localStorage.setItem("ledger", JSON.stringify(ledgerValues));
  renderLedger();
}

function clearLedger() {
  ledgerValues = [];
  saveAndRenderLedger();
}

/* ---------- Global Key Listeners ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") {
    addToLedger();
  }
});

/* ---------- Initial run ---------- */
calculateDiscount();
renderLedger();