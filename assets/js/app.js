// AgriConnect Interactive App Logic

let currentLang = 'en';
let committedQuantity = 0;
let feasibilityChartInstance = null;
let impactChartInstance = null;

// Crop Rates & Mandi Benchmark DB
const CROP_DATA = {
    tomato: { name: "Tomato (Grade A)", mandi: 16.50, agriconnect: 20.00, lossMandi: 18, lossAgri: 8 },
    onion: { name: "Onion (Grade B)", mandi: 24.00, agriconnect: 28.50, lossMandi: 15, lossAgri: 7 },
    potato: { name: "Potato (Jyoti)", mandi: 18.00, agriconnect: 22.00, lossMandi: 12, lossAgri: 5 },
    wheat: { name: "Sharbati Wheat", mandi: 25.00, agriconnect: 29.00, lossMandi: 10, lossAgri: 4 },
    rice: { name: "Basmati Rice", mandi: 45.00, agriconnect: 52.00, lossMandi: 10, lossAgri: 4 }
};

document.addEventListener('DOMContentLoaded', () => {
    initLanguage('en');
    initCharts();
    calculateROI();
    calculateLogistics();

    // Event listeners
    document.getElementById('langSelect').addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });

    document.getElementById('cropSelect').addEventListener('change', calculateROI);
    document.getElementById('qtyInput').addEventListener('input', calculateROI);

    document.getElementById('truckTonnage').addEventListener('input', calculateLogistics);
    document.getElementById('distanceKm').addEventListener('input', calculateLogistics);
});

// Language Switcher Function
function switchLanguage(lang) {
    currentLang = lang;
    const langObj = translations[lang] || translations['en'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langObj[key]) {
            if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                el.placeholder = langObj[key];
            } else {
                el.innerText = langObj[key];
            }
        }
    });
}

function initLanguage(lang) {
    switchLanguage(lang);
}

// Mobile App Simulation Quick Supply Action
function addSupply(amount) {
    committedQuantity += amount;
    const progressEl = document.getElementById('supplyProgress');
    const statusTextEl = document.getElementById('supplyStatusText');
    const target = 2500; // 2.5 Tons = 2500 kg
    
    const percentage = Math.min(100, Math.round((committedQuantity / target) * 100));
    
    if (progressEl) {
        progressEl.style.width = `${percentage}%`;
    }
    
    if (statusTextEl) {
        statusTextEl.innerText = `${committedQuantity} / ${target} kg Committed (${percentage}%)`;
    }

    // Trigger Toast Notification
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (toast && toastMsg) {
        const langObj = translations[currentLang] || translations['en'];
        toastMsg.innerText = `${langObj.suppliedSuccess || 'Offer submitted for'} ${amount} kg!`;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }

    // Launch celebratory confetti if completed
    if (committedQuantity >= target && typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 }
        });
    }
}

// ROI & Net Realization Calculator Logic
function calculateROI() {
    const cropKey = document.getElementById('cropSelect').value;
    const qtyQuintals = parseFloat(document.getElementById('qtyInput').value) || 50; // 1 Quintal = 100kg
    const qtyKg = qtyQuintals * 100;

    const crop = CROP_DATA[cropKey] || CROP_DATA.tomato;

    // Traditional Mandi math:
    // Mandi Price - 18% post harvest loss - 8% agent commission - 10% freight inefficiencies = ~60% net realization
    const mandiGross = qtyKg * crop.mandi;
    const mandiNet = mandiGross * 0.60;

    // AgriConnect Math:
    // Direct Price + 8% post harvest loss savings + Pooled logistics savings = ~75-80% net realization
    const agriGross = qtyKg * crop.agriconnect;
    const agriNet = agriGross * 0.78;

    const extraGain = agriNet - mandiNet;
    const percentGain = Math.round((extraGain / mandiNet) * 100);

    // Update UI elements
    document.getElementById('qtyDisplay').innerText = `${qtyQuintals} Quintals (${qtyKg.toLocaleString()} kg)`;
    document.getElementById('mandiResult').innerText = `₹${Math.round(mandiNet).toLocaleString()}`;
    document.getElementById('agriResult').innerText = `₹${Math.round(agriNet).toLocaleString()}`;
    document.getElementById('extraGainResult').innerText = `+₹${Math.round(extraGain).toLocaleString()} (+${percentGain}%)`;
}

// Shared Logistics Calculator Logic
function calculateLogistics() {
    const tonnage = parseFloat(document.getElementById('truckTonnage').value) || 5;
    const distance = parseFloat(document.getElementById('distanceKm').value) || 120;

    // Standalone logistics cost per ton per km = ₹15
    const standaloneCost = tonnage * distance * 18;

    // Shared Pooled truck (AgriConnect 25% cost reduction)
    const pooledCost = standaloneCost * 0.75;
    const savings = standaloneCost - pooledCost;

    document.getElementById('tonnageDisplay').innerText = `${tonnage} Tons`;
    document.getElementById('distanceDisplay').innerText = `${distance} km`;

    document.getElementById('standaloneLogisticsCost').innerText = `₹${Math.round(standaloneCost).toLocaleString()}`;
    document.getElementById('pooledLogisticsCost').innerText = `₹${Math.round(pooledCost).toLocaleString()}`;
    document.getElementById('logisticsSavings').innerText = `₹${Math.round(savings).toLocaleString()} Saved (25%)`;
}

// Chart.js Visualizations Setup
function initCharts() {
    // 1. Feasibility & Value Radar Chart (Slide 4)
    const ctxRadar = document.getElementById('feasibilityRadarChart');
    if (ctxRadar) {
        feasibilityChartInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: [
                    'Technical Feasibility', 
                    'Data Availability', 
                    'Implementation Complexity', 
                    'Farmer Impact', 
                    'Buyer Value', 
                    'Scalability'
                ],
                datasets: [
                    {
                        label: 'Existing Solutions (Traditional Mandi)',
                        data: [7.0, 6.0, 5.0, 5.8, 6.8, 6.8],
                        backgroundColor: 'rgba(217, 119, 6, 0.2)',
                        borderColor: '#d97706',
                        pointBackgroundColor: '#d97706',
                        borderWidth: 2
                    },
                    {
                        label: 'AgriConnect (Proposed Solution)',
                        data: [8.5, 7.8, 6.0, 9.2, 8.8, 8.8],
                        backgroundColor: 'rgba(5, 150, 105, 0.25)',
                        borderColor: '#059669',
                        pointBackgroundColor: '#059669',
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: '#e2e8f0' },
                        grid: { color: '#cbd5e1' },
                        pointLabels: {
                            font: { size: 12, family: 'Plus Jakarta Sans', weight: '600' },
                            color: '#334155'
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
                    }
                }
            }
        });
    }

    // 2. Impact Comparison Bar Chart (Slide 5)
    const ctxBar = document.getElementById('impactBarChart');
    if (ctxBar) {
        impactChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: [
                    'Farmer Realization (% Consumer ₹)', 
                    'Post-Harvest Losses (%)', 
                    'Logistics Cost Index', 
                    'Direct Buyer Proc. (%)'
                ],
                datasets: [
                    {
                        label: 'Traditional Mandi Baseline',
                        data: [60, 18, 100, 15],
                        backgroundColor: '#f59e0b',
                        borderRadius: 6
                    },
                    {
                        label: 'AgriConnect Proposed',
                        data: [75, 10, 75, 60],
                        backgroundColor: '#059669',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}${context.dataIndex === 2 ? ' (Index)' : '%'}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 110
                    }
                }
            }
        });
    }
}

// Stakeholder Tab Switcher
function showTab(tabId) {
    const tabs = ['farmer', 'fpo', 'buyer', 'logistics', 'govt'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tabBtn-${t}`);
        const content = document.getElementById(`tabContent-${t}`);
        if (btn && content) {
            if (t === tabId) {
                btn.className = 'px-4 py-2 font-semibold text-emerald-700 border-b-2 border-emerald-600 focus:outline-none transition';
                content.classList.remove('hidden');
            } else {
                btn.className = 'px-4 py-2 font-medium text-slate-500 hover:text-slate-700 border-b-2 border-transparent focus:outline-none transition';
                content.classList.add('hidden');
            }
        }
    });
}

// Modal helper
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }
}
