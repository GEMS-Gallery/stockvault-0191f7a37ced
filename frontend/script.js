import { backend } from 'declarations/backend';

// Chart.js configurations for the doughnut charts
const allocationData = {
    labels: ['Equity (64%)', 'Fixed Income (17%)', 'Cash (17%)', 'Crypto (1%)'],
    datasets: [{
        data: [64, 17, 17, 1],
        backgroundColor: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6']
    }]
};

const classesData = {
    labels: ['ETF (41%)', 'Stock (17%)', 'Bonds (23%)', 'Cash (17%)', 'Crypto (1%)'],
    datasets: [{
        data: [41, 17, 23, 17, 1],
        backgroundColor: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7']
    }]
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
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
};

// Function to create charts
function createChart(elementId, chartData, chartOptions) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions
    });
}

// Create the bar chart
function createBarChart() {
    const sectorsData = [
        { label: 'Others', value: 50 },
        { label: 'Technology', value: 15 },
        { label: 'Financial Services', value: 10 },
        { label: 'Consumer Cyclical', value: 8 },
        { label: 'Communication Services', value: 7 },
        { label: 'Consumer Staples', value: 5 },
        { label: 'Basic Materials', value: 3 },
        { label: 'Healthcare', value: 2 }
    ];

    const barChart = document.getElementById('sectorsChart');
    barChart.innerHTML = '';
    sectorsData.forEach(item => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${item.value}%`;
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = item.label;
        
        bar.appendChild(label);
        barChart.appendChild(bar);
    });
}

// Function to initialize charts
function initializeCharts() {
    createChart('allocationChart', allocationData, doughnutOptions);
    createChart('classesChart', classesData, doughnutOptions);
    createBarChart();
}

// Function to switch between Holdings and Allocations pages
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    const tabs = document.querySelectorAll('.tab');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        }
    });

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.page === pageName) {
            tab.classList.add('active');
        }
    });

    if (pageName === 'allocations') {
        initializeCharts();
    }
}

// Function to render holdings table
async function renderHoldingsTable() {
    try {
        const portfolio = await backend.getPortfolio();
        const tableBody = document.getElementById('holdings-table-body');
        tableBody.innerHTML = '';
        
        portfolio.holdings.forEach(holding => {
            const row = tableBody.insertRow();
            const marketValue = holding.quantity * holding.currentPrice;
            const performance = ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
            const performanceValue = marketValue - (holding.quantity * holding.purchasePrice);
            
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
    } catch (error) {
        console.error("Error fetching portfolio:", error);
    }
}

// Function to handle adding a new asset
async function handleAddAsset(event) {
    event.preventDefault();
    const form = event.target;
    const symbol = form.symbol.value;
    const name = form.name.value;
    const quantity = parseFloat(form.quantity.value);
    const purchasePrice = parseFloat(form.purchasePrice.value);
    const assetType = form.assetType.value;

    try {
        await backend.addOrUpdateHolding(symbol, name, quantity, purchasePrice, purchasePrice, assetType);
        await renderHoldingsTable();
        closeModal();
        form.reset();
    } catch (error) {
        console.error("Error adding asset:", error);
    }
}

// Function to open the modal
function openModal() {
    document.getElementById('add-asset-modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('add-asset-modal').style.display = 'none';
}

// Initialize the page and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    showPage('holdings');
    renderHoldingsTable();
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showPage(tab.dataset.page);
        });
    });

    document.getElementById('add-asset-btn').addEventListener('click', openModal);
    document.getElementById('add-asset-form').addEventListener('submit', handleAddAsset);

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == document.getElementById('add-asset-modal')) {
            closeModal();
        }
    }
});