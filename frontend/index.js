import { backend } from 'declarations/backend';

let holdings = [];

async function refreshHoldings() {
    holdings = await backend.getAllHoldings();
    const totalValue = await backend.getTotalPortfolioValue();
    
    const tbody = document.querySelector('#holdingsTable tbody');
    tbody.innerHTML = '';
    
    holdings.forEach(holding => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${holding.symbol}</td>
            <td>${holding.quantity}</td>
            <td>$${holding.purchasePrice.toFixed(2)}</td>
            <td>$${(holding.quantity * holding.purchasePrice).toFixed(2)}</td>
            <td><button onclick="removeHolding('${holding.symbol}')">Remove</button></td>
        `;
    });

    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
}

async function addOrUpdateHolding(event) {
    event.preventDefault();
    const symbol = document.getElementById('symbol').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);

    await backend.addOrUpdateHolding(symbol, quantity, purchasePrice);
    await refreshHoldings();
    event.target.reset();
}

async function removeHolding(symbol) {
    await backend.removeHolding(symbol);
    await refreshHoldings();
}

document.getElementById('addHoldingForm').addEventListener('submit', addOrUpdateHolding);

// Initial load
refreshHoldings();