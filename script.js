let currentRoundFigure = 0;
let ledgerValues = [];

// Load system preferred or saved theme setting automatically on start
(function initTheme() {
  const savedTheme = localStorage.getItem('rv_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleThemeMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('rv_theme', newTheme);
}

function formatCurrency(amount, maxFractionDigits = 2) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: maxFractionDigits
  }).format(amount);
}

function calculateDiscount() {
  const originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
  const discountPercent = parseFloat(document.getElementById('discountPercentage').value) || 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  currentRoundFigure = Math.round(finalPrice);

  document.getElementById('discountAmount').innerText = formatCurrency(discountAmount);
  document.getElementById('finalPrice').innerText = formatCurrency(finalPrice);
  document.getElementById('roundFigure').innerText = formatCurrency(currentRoundFigure, 0);
}

// FIX: Changes type temporarily to allow character select positioning ranges
function clearPlaceholder(element, defaultValue) {
  element.closest('.input-card').classList.add('focused-card');
  if (element.value === defaultValue || parseFloat(element.value) === 0) {
    element.value = '';
  } else {
    const cachedValue = element.value;
    // Shift type to text to expose text selection properties safely
    element.type = 'text';

    // Timeout separates the type shift operation from selection updates
    setTimeout(() => {
      element.setSelectionRange(cachedValue.length, cachedValue.length);
      // Revert configuration back to safe numbers formatting
      element.type = 'number';
    }, 10);
  }
}

function restorePlaceholder(element, defaultValue) {
  element.closest('.input-card').classList.remove('focused-card');
  if (element.value.trim() === '') {
    element.value = defaultValue;
    calculateDiscount();
  }
}

function addToLedger() {
  if (currentRoundFigure <= 0) return;

  ledgerValues.push(currentRoundFigure);
  renderLedger();

  // Brief "ink stamp" press animation on the add button
  const btn = document.querySelector('.add-ledger-btn');
  if (btn) {
    btn.classList.add('stamped');
    setTimeout(() => btn.classList.remove('stamped'), 180);
  }

  // Wipes layout figures back to operational base zeros
  document.getElementById('originalPrice').value = '0.00';
  document.getElementById('discountPercentage').value = '0';
  calculateDiscount();
}

function renderLedger() {
  const container = document.getElementById('ledgerContainer');

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

function clearLedger() {
  ledgerValues = [];
  renderLedger();
}

calculateDiscount();