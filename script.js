let currentRoundFigure = 0;

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

    // Logic Calculations
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    currentRoundFigure = Math.round(finalPrice);

    // Update UI elements instantly
    document.getElementById('discountAmount').innerText = formatCurrency(discountAmount);
    document.getElementById('finalPrice').innerText = formatCurrency(finalPrice);
    
    // Format round figure without decimals as seen in screenshot
    document.getElementById('roundFigure').innerText = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(currentRoundFigure);
}

function addToLedger() {
    const container = document.getElementById('ledgerContainer');
    
    // Clear out placeholder text on first entry insertion
    if (container.classList.contains('ledger-placeholder')) {
        container.innerHTML = '<div class="ledger-list"></div>';
        container.classList.remove('ledger-placeholder');
    }
    
    const list = container.querySelector('.ledger-list');
    const newItem = document.createElement('div');
    newItem.className = 'ledger-item';
    
    const formattedVal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(currentRoundFigure);
    
    newItem.innerText = `Added: ${formattedVal}`;
    list.appendChild(newItem);
    
    // Auto Scroll Ledger to view latest entries
    container.scrollTop = container.scrollHeight;
}

// Initial display execution on load
calculateDiscount();