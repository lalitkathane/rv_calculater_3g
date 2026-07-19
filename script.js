let currentRoundFigure = 0;
let ledgerValues = [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
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
    
    document.getElementById('roundFigure').innerText = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(currentRoundFigure);
}

// Focus helpers to wipe default placeholder values out
function clearPlaceholder(element, defaultValue) {
    if (element.value === defaultValue) {
        element.value = '';
    }
}

function restorePlaceholder(element, defaultValue) {
    if (element.value.trim() === '') {
        element.value = defaultValue;
        calculateDiscount();
    }
}

function addToLedger() {
    // Only add if the value is greater than 0
    if (currentRoundFigure <= 0) return;

    ledgerValues.push(currentRoundFigure);
    renderLedger();
}

function renderLedger() {
    const container = document.getElementById('ledgerContainer');
    
    if (ledgerValues.length === 0) {
        container.innerHTML = 'Tap the ↓ button to add the round figure here.';
        container.classList.add('ledger-placeholder');
        return;
    }

    container.classList.remove('ledger-placeholder');
    
    // Joint items using standard arithmetic display
    const formulaString = ledgerValues.join(' + ');
    const totalSum = ledgerValues.reduce((sum, val) => sum + val, 0);
    
    const formattedTotal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(totalSum);

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

// Initial default configuration execution
calculateDiscount();