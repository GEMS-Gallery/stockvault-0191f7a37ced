// Initialize Chart.js configurations and data

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
    maintainAspectRatio: true, // Set to true to maintain aspect ratio
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

// Initialize the page with the Holdings tab active and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    showPage('holdings');
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showPage(tab.dataset.page);
        });
    });
});