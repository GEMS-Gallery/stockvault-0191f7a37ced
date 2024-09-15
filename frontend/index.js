import { backend } from 'declarations/backend';

// Initialize Feather Icons
feather.replace();

let portfolio = null;

async function fetchPortfolio() {
    try {
        portfolio = await backend.getPortfolio();
        renderHoldingsTable();
        renderAllocationCharts();
        renderHoldingsGrid();
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

function renderHoldingsTable() {
    const tbody = document.getElementById('holdings-table-body');
    tbody.innerHTML = '';
    
    portfolio.holdings.forEach(holding => {
        const row = tbody.insertRow();
        const marketValue = holding.quantity * holding.currentPrice;
        const performance = ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
        const performanceValue = (marketValue - (holding.quantity * holding.purchasePrice));
        
        row.innerHTML = `
            <td><span class="stock-symbol">${holding.symbol}</span> ${holding.name}</td>
            <td>${holding.quantity.toFixed(4)}</td>
            <td>$${marketValue.toFixed(2)}</td>
            <td>$${holding.currentPrice.toFixed(2)}</td>
            <td class="${performance >= 0 ? 'positive' : 'negative'}">
                ${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%<br>
                ${performanceValue >= 0 ? '+' : ''}$${Math.abs(performanceValue).toFixed(2)}
            </td>
            <td>${holding.assetType}</td>
        `;
    });
}

function renderAllocationCharts() {
    renderDoughnutChart('allocationChart', portfolio.allocation);
    renderDoughnutChart('classesChart', portfolio.assetClasses);
    renderBarChart('sectorsChart', portfolio.sectors);
}

function renderDoughnutChart(elementId, data) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => `${item[0]} (${item[1].toFixed(0)}%)`),
            datasets: [{
                data: data.map(item => item[1]),
                backgroundColor: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        boxWidth: 15
                    }
                }
            }
        }
    });
}

function renderBarChart(elementId, data) {
    const barChart = document.getElementById(elementId);
    barChart.innerHTML = '';
    data.forEach(item => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${item[1]}%`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = item[0];
        
        bar.appendChild(label);
        barChart.appendChild(bar);
    });
}

function renderHoldingsGrid() {
    const grid = document.getElementById('holdings-grid');
    grid.innerHTML = '';
    
    portfolio.holdings.forEach(holding => {
        const performance = ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
        const div = document.createElement('div');
        div.className = `holding-item ${performance >= 0 ? '' : 'negative'}`;
        div.innerHTML = `
            <div>${holding.symbol}</div>
            <div class="performance ${performance >= 0 ? 'positive' : 'negative'}">
                ${performance >= 0 ? '+' : ''}${performance.toFixed(2)}%
            </div>
        `;
        grid.appendChild(div);
    });
}

function showPage(pageName) {
    const pages = document.querySelectorAll('#holdings-page, #allocations-page');
    const tabs = document.querySelectorAll('.tab');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase() === pageName) {
            tab.classList.add('active');
        }
    });

    if (pageName === 'allocations') {
        renderAllocationCharts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPortfolio();
    showPage('holdings');
});

document.querySelector('.add-asset-btn').addEventListener('click', async () => {
    // Implement add asset functionality
    console.log("Add asset button clicked");
});