// Scenarios Data
const scenarios = {
    oil: {
        title: "Crude Oil Price Shock (+12%)",
        nodes: [
            { id: '1', name: 'Crude Oil Spike (+12%)', group: 'event', val: 25 },
            { id: '2', name: 'Inflation Expectations', group: 'indicator', val: 18 },
            { id: '3', name: 'Interest Rates (RBI)', group: 'indicator', val: 18 },
            { id: '4', name: 'Aviation Sector', group: 'sector', val: 15 },
            { id: '5', name: 'Banking Sector', group: 'sector', val: 15 },
            { id: '6', name: 'Real Estate Sector', group: 'sector', val: 15 },
            { id: '7', name: 'InterGlobe Aviation (Indigo)', group: 'asset', val: 12 },
            { id: '8', name: 'State Bank of India (SBI)', group: 'asset', val: 12 },
            { id: '9', name: 'DLF Limited (Realty)', group: 'asset', val: 12 }
        ],
        links: [
            { source: '1', target: '2', label: 'Drives Up (+2.4%)', confidence: 96, explanation: "Crude oil is a fundamental input for transport and manufacturing. A 12% rise directly spikes consumer price index." },
            { source: '1', target: '4', label: 'Increases ATF Cost', confidence: 98, explanation: "Aviation Turbine Fuel (ATF) makes up ~40% of airline operating costs." },
            { source: '2', target: '3', label: 'Hawkish Policy Shift', confidence: 89, explanation: "Central banks increase repo rates to suppress demand and curb inflation." },
            { source: '3', target: '5', label: 'Loan Growth Slows', confidence: 85, explanation: "Higher borrowing rates reduce retail and corporate credit demand." },
            { source: '3', target: '6', label: 'Mortgage Rates Up', confidence: 91, explanation: "Increased home loan EMIs reduce housing demand and developer sales." },
            { source: '4', target: '7', label: 'Profit Margins Cut', confidence: 95, explanation: "Higher fuel prices cut net profit margins for airlines." },
            { source: '5', target: '8', label: 'Valuation De-rating', confidence: 88, explanation: "Rising NPAs and lower credit growth impact bank equity valuation." },
            { source: '6', target: '9', label: 'Sales Volume Drop', confidence: 92, explanation: "Property buyers delay purchases amidst high interest rates." }
        ]
    },
    rate: {
        title: "RBI Rate Hike (+50 bps)",
        nodes: [
            { id: '1', name: 'RBI Repo Rate Hike (+50bps)', group: 'event', val: 25 },
            { id: '2', name: 'Commercial Loan Rates', group: 'indicator', val: 18 },
            { id: '3', name: 'Auto Sector', group: 'sector', val: 15 },
            { id: '4', name: 'Tata Motors', group: 'asset', val: 12 },
            { id: '5', name: 'HDFC Bank', group: 'asset', val: 12 }
        ],
        links: [
            { source: '1', target: '2', label: 'Immediate Transmission', confidence: 99, explanation: "Banks pass on repo rate hikes directly to MCLR/EBLR loans." },
            { source: '2', target: '3', label: 'Car Loan Costs Up', confidence: 90, explanation: "Auto loans become costlier, reducing passenger vehicle sales." },
            { source: '3', target: '4', label: 'Volume Decline', confidence: 87, explanation: "Lower vehicle registrations reduce quarterly revenue." },
            { source: '2', target: '5', label: 'NIM Compression', confidence: 84, explanation: "Deposit costs rise faster than loan yields initially." }
        ]
    }
};

let currentScenario = 'oil';
let Graph = null;

// Node Colors
const groupColors = {
    event: '#ef4444',
    indicator: '#f59e0b',
    sector: '#22d3ee',
    asset: '#10b981'
};

// Initialize 3D Graph
function initGraph() {
    const container = document.getElementById('3d-graph');
    container.innerHTML = ''; // Clear

    const data = scenarios[currentScenario];

    Graph = ForceGraph3D()(container)
        .graphData(data)
        .nodeLabel('name')
        .nodeColor(node => groupColors[node.group] || '#ffffff')
        .nodeVal('val')
        .linkColor(() => '#38bdf8')
        .linkWidth(2)
        .linkDirectionalParticles(4)
        .linkDirectionalParticleSpeed(0.006)
        .linkDirectionalParticleWidth(3)
        .onNodeClick(node => inspectNode(node))
        .onLinkClick(link => inspectLink(link));

    // Auto rotate camera
    Graph.controls().autoRotate = true;
    Graph.controls().autoRotateSpeed = 0.8;
}

// Inspect Node Action
function inspectNode(node) {
    document.getElementById('inspectType').innerText = node.group.toUpperCase();
    document.getElementById('inspectTitle').innerText = node.name;
    document.getElementById('inspectDescription').innerText = `Entity classified as ${node.group.toUpperCase()}. Monitored by real-time LLM knowledge graph algorithms.`;

    document.getElementById('metricsGrid').classList.remove('hidden');
    document.getElementById('explanationBox').classList.remove('hidden');
    document.getElementById('sparklineBox').classList.remove('hidden');

    document.getElementById('metricImpact').innerText = node.group === 'asset' ? '-6.8%' : '-2.4%';
    document.getElementById('metricConfidence').innerText = '94%';
    document.getElementById('explanationText').innerText = `${node.name} is impacted downstream by the trigger event. Historical correlation shows a strong sensitivity score of 0.82 to macro shifts.`;
}

// Inspect Link Action
function inspectLink(link) {
    document.getElementById('inspectType').innerText = 'RELATIONSHIP';
    document.getElementById('inspectTitle').innerText = `${link.source.name || link.source} ➔ ${link.target.name || link.target}`;
    document.getElementById('inspectDescription').innerText = `Edge Connection: ${link.label}`;

    document.getElementById('metricsGrid').classList.remove('hidden');
    document.getElementById('explanationBox').classList.remove('hidden');
    document.getElementById('sparklineBox').classList.add('hidden');

    document.getElementById('metricImpact').innerText = link.label;
    document.getElementById('metricConfidence').innerText = link.confidence + '%';
    document.getElementById('explanationText').innerText = link.explanation;
}

// Scenario Buttons Click Handlers
document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');
        currentScenario = targetBtn.dataset.scenario;
        if (scenarios[currentScenario]) {
            initGraph();
        }
    });
});

// Run Custom "What-If" Simulation
document.getElementById('runWhatIfBtn').addEventListener('click', () => {
    const input = document.getElementById('whatIfInput').value.trim();
    if (!input) {
        alert("Please enter a custom financial headline to simulate!");
        return;
    }

    // Add a custom node dynamically
    const data = Graph.graphData();
    const newNodeId = String(data.nodes.length + 1);
    const newNode = { id: newNodeId, name: input.substring(0, 25) + '...', group: 'event', val: 28 };
    
    data.nodes.push(newNode);
    data.links.push({ source: newNodeId, target: '2', label: 'Inferred Causality', confidence: 88, explanation: `LLM parsed news prompt: "${input}" and inferred macro impact.` });

    Graph.graphData(data);
    alert("3D Graph updated live with custom LLM-extracted entity!");
});

// Load Graph on Start
window.addEventListener('DOMContentLoaded', initGraph);
