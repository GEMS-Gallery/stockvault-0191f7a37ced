import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as portfolioTrackerIDL } from "./declarations/portfolio_tracker/portfolio_tracker.did.js";

// Initialize Feather Icons
feather.replace();

// Initialize the Internet Computer agent and actor
const agent = new HttpAgent();
const portfolioTrackerActor = Actor.createActor(portfolioTrackerIDL, {
  agent,
  canisterId: process.env.PORTFOLIO_TRACKER_CANISTER_ID,
});

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
    barChart.innerHTML = ''; // Clear existing content
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

// Function to initialize charts when they come into view
function initializeCharts() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'allocationChart') {
                    createChart('allocationChart', allocationData, doughnutOptions);
                } else if (entry.target.id === 'classesChart') {
                    createChart('classesChart', classesData, doughnutOptions);
                } else if (entry.target.id === 'sectorsChart') {
                    createBarChart();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    ['allocationChart', 'classesChart', 'sectorsChart'].forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
    });
}

// Function to switch between Holdings and Allocations pages
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
        initializeCharts();
    }
}

// Function to update the holdings table
async function updateHoldingsTable() {
    try {
        const portfolio = await portfolioTrackerActor.getPortfolio();
        const tableBody = document.querySelector('.holdings-table tbody');
        tableBody.innerHTML = ''; // Clear existing content

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
        console.error('Error fetching portfolio:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Start with the Holdings page active
    showPage('holdings');

    // Fetch and update holdings table
    updateHoldingsTable();

    // Set up event listeners for tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => showPage(tab.textContent.toLowerCase()));
    });
});