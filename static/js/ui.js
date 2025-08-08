const defaultColors = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#845ef7', '#ffa94d', '#20c997', '#e64980'];
const planetData = [
    { mass: 1989000, position: { x: 0, y: 0, z: 0 }, velocity: { vx: 0, vy: 0, vz: 0 }, color: 'yellow' },           // Sun
    { mass: 0.330, position: { x: 57910000, y: 0, z: 0 }, velocity: { vx: 0, vy: 47.87, vz: 0 }, color: 'grey' },   // Mercury
    { mass: 4.87, position: { x: 108200000, y: 0, z: 0 }, velocity: { vx: 0, vy: 35.02, vz: 0 }, color: 'orange' },  // Venus
    { mass: 5.97, position: { x: 149600000, y: 0, z: 0 }, velocity: { vx: 0, vy: 29.78, vz: 0 }, color: 'blue' },    // Earth
    { mass: 0.642, position: { x: 227940000, y: 0, z: 0 }, velocity: { vx: 0, vy: 24.07, vz: 0 }, color: 'red' },    // Mars
    { mass: 1898, position: { x: 778330000, y: 0, z: 0 }, velocity: { vx: 0, vy: 13.07, vz: 0 }, color: 'brown' },   // Jupiter
    { mass: 568, position: { x: 1429400000, y: 0, z: 0 }, velocity: { vx: 0, vy: 9.69, vz: 0 }, color: 'yellow' },   // Saturn
    { mass: 86.8, position: { x: 2870990000, y: 0, z: 0 }, velocity: { vx: 0, vy: 6.81, vz: 0 }, color: 'cyan' },    // Uranus
    { mass: 102, position: { x: 4504300000, y: 0, z: 0 }, velocity: { vx: 0, vy: 5.43, vz: 0 }, color: 'blue' }     // Neptune
];

const preconfiguredSetups = {
    solarSystem: planetData,
    classic3Body: [
        { mass: 5.972, position: { x: 0, y: 1e6, z: 0 }, velocity: { vx: -0.5, vy: 0, vz: 0 }, color: 'red' },
        { mass: 5.972, position: { x: -Math.sqrt(3) * 1e6 / 2, y: -0.5 * 1e6, z: 0 }, velocity: { vx: 0.25, vy: Math.sqrt(3) * 0.25, vz: 0 }, color: 'green' },
        { mass: 5.972, position: { x: Math.sqrt(3) * 1e6 / 2, y: -0.5 * 1e6, z: 0 }, velocity: { vx: 0.25, vy: -Math.sqrt(3) * 0.25, vz: 0 }, color: 'blue' }
    ],
    figureEight: [
        { mass: 5.972, position: { x: -1e6, y: 0, z: 0 }, velocity: { vx: 0.347, vy: 0.532, vz: 0 }, color: 'red' },
        { mass: 5.972, position: { x: 1e6, y: 0, z: 0 }, velocity: { vx: 0.347, vy: 0.532, vz: 0 }, color: 'green' },
        { mass: 5.972, position: { x: 0, y: 0, z: 0 }, velocity: { vx: -0.694, vy: -1.064, vz: 0 }, color: 'blue' }
    ],
    random3Body: [
        { mass: 5.972, position: { x: 100000, y: 200000, z: 0 }, velocity: { vx: -1, vy: 0, vz: 0 }, color: 'red' },
        { mass: 5.972, position: { x: -100000, y: -200000, z: 0 }, velocity: { vx: 1, vy: 0.5, vz: 0 }, color: 'green' },
        { mass: 5.972, position: { x: 0, y: 100000, z: 0 }, velocity: { vx: 0.5, vy: -1, vz: 0 }, color: 'blue' }
    ],
    hierarchicalTriple: [
        { mass: 59.72, position: { x: 0, y: 0, z: 0 }, velocity: { vx: 0, vy: 0, vz: 0 }, color: 'yellow' },
        { mass: 5.972, position: { x: 50000, y: 0, z: 0 }, velocity: { vx: 0, vy: 3, vz: 0 }, color: 'blue' },
        { mass: 0.5972, position: { x: -200000, y: 0, z: 0 }, velocity: { vx: 0, vy: -1, vz: 0 }, color: 'green' }
    ]
};
        
function loadPreconfiguredSetup() {
    const setupName = document.getElementById('preconfiguredSetups').value;
    const setup = preconfiguredSetups[setupName];
    if (setup) {
        // Clear existing rows
        const tableBody = document.querySelector('#input-table tbody');
        tableBody.innerHTML = '';
        numBodies = 0;
        // Reset data arrays for debug/pre-sim display
        positions.length = 0;
        velocities.length = 0;
        masses.length = 0;
        colors.length = 0;

        // Cancel any ongoing streaming state
        trajectories = [];
        step = 0;
        setPaused(true);
        toggleLoader(false);
    
        // Add rows for the selected setup
        setup.forEach(body => {
            numBodies++;
            const row = tableBody.insertRow();
            const bodyCell = row.insertCell(0);
            const massCell = row.insertCell(1);
            const positionCell = row.insertCell(2);
            const velocityCell = row.insertCell(3);
            const colorCell = row.insertCell(4);
            const actionCell = row.insertCell(5);
    
            bodyCell.innerHTML = `Body ${numBodies}`;
            massCell.innerHTML = `<input type="number" class="form-control" value="${body.mass}" step="any" id="mass${numBodies}">`;
            positionCell.innerHTML = `
                <input type="number" class="form-control" value="${body.position.x}" step="any" id="pos${numBodies}x">
                <input type="number" class="form-control" value="${body.position.y}" step="any" id="pos${numBodies}y">
                <input type="number" class="form-control" value="${body.position.z}" step="any" id="pos${numBodies}z">`;
            velocityCell.innerHTML = `
                <input type="number" class="form-control" value="${body.velocity.vx}" step="any" id="vel${numBodies}x">
                <input type="number" class="form-control" value="${body.velocity.vy}" step="any" id="vel${numBodies}y">
                <input type="number" class="form-control" value="${body.velocity.vz}" step="any" id="vel${numBodies}z">`;
            colorCell.innerHTML = `<input type="color" class="form-control form-control-color" value="${cssColor(body.color)}" id="color${numBodies}">`;
            actionCell.innerHTML = `<button type="button" class="btn btn-danger" onclick="removeRow(this)">Remove</button>`;
    
            positions.push([body.position.x, body.position.y, body.position.z]);
            velocities.push([body.velocity.vx, body.velocity.vy, body.velocity.vz]);
            masses.push(body.mass);
            colors.push(body.color);
        });
    
        checkBodies();
    }
}

function addRow() {
    numBodies++;
    const tableBody = document.querySelector('#input-table tbody');
    const row = tableBody.insertRow();
    
    const bodyCell = row.insertCell(0);
    bodyCell.innerHTML = `Body ${numBodies}`;
    
    const massCell = row.insertCell(1);
    massCell.innerHTML = `<input type="number" class="form-control" value="1" step="any" id="mass${numBodies}">`;
    
    const positionCell = row.insertCell(2);
    positionCell.innerHTML = `
        <input type="number" class="form-control" value="0" step="any" id="pos${numBodies}x">
        <input type="number" class="form-control" value="0" step="any" id="pos${numBodies}y">
        <input type="number" class="form-control" value="0" step="any" id="pos${numBodies}z">`;
    
    const velocityCell = row.insertCell(3);
    velocityCell.innerHTML = `
        <input type="number" class="form-control" value="0" step="any" id="vel${numBodies}x">
        <input type="number" class="form-control" value="0" step="any" id="vel${numBodies}y">
        <input type="number" class="form-control" value="0" step="any" id="vel${numBodies}z">`;
    
    const colorCell = row.insertCell(4);
    const defaultColor = defaultColors[(numBodies - 1) % defaultColors.length];
    colorCell.innerHTML = `<input type="color" class="form-control form-control-color" value="${defaultColor}" id="color${numBodies}">`;
    
    const actionCell = row.insertCell(5);
    actionCell.innerHTML = `<button type="button" class="btn btn-danger" onclick="removeRow(this)">Remove</button>`;
    checkBodies();
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    const rowIndex = row.rowIndex - 1;
    // Remove the row from the table
    document.getElementById('input-table').deleteRow(rowIndex + 1);

    // Remove the corresponding elements from the arrays
    positions.splice(rowIndex, 1);
    velocities.splice(rowIndex, 1);
    masses.splice(rowIndex, 1);
    colors.splice(rowIndex, 1);

    numBodies--;

    // Stop the simulation if a body is removed
    stopSimulation();

    checkBodies();
}

function checkBodies() {
    const runSimulationButton = document.getElementById('runSimulationButton');
    runSimulationButton.disabled = numBodies === 0;
    refreshFollowBodyOptions();
}

function runSimulation() {
    masses = [];
    colors = [];
    const posArray = [];
    const velArray = [];
    for (let i = 1; i <= numBodies; i++) {
        const mass = parseFloat(document.getElementById(`mass${i}`).value);
        const pos = [
            parseFloat(document.getElementById(`pos${i}x`).value),
            parseFloat(document.getElementById(`pos${i}y`).value),
            parseFloat(document.getElementById(`pos${i}z`).value),
        ];
        const vel = [
            parseFloat(document.getElementById(`vel${i}x`).value),
            parseFloat(document.getElementById(`vel${i}y`).value),
            parseFloat(document.getElementById(`vel${i}z`).value),
        ];
        const color = document.getElementById(`color${i}`).value;

        // Check for NaN values
        if (isNaN(mass) || pos.includes(NaN) || vel.includes(NaN)) {
            console.error(`Invalid input for body ${i}`);
            return;
        }

        masses.push(mass);
        posArray.push(pos);
        velArray.push(vel);
        colors.push(color);
    }

    const numSteps = parseInt(document.getElementById('numSteps').value);
    const timeScale = parseFloat(document.getElementById('timeScale').value);

    console.log("Starting simulation with:", { masses, positions: posArray, velocities: velArray, num_steps: numSteps, time_scale: timeScale });

    const dt = 1; // Time step in seconds (base)

    const continuous = document.getElementById('continuousMode')?.checked;
    const batchStepsInput = document.getElementById('batchSteps');
    const batchSteps = parseInt(batchStepsInput?.value || '50', 10);

    toggleLoader(true);
    if (!continuous) {
        fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ masses, positions: posArray, velocities: velArray, num_steps: numSteps, dt, time_scale: timeScale })
        })
        .then(response => response.json())
        .then(data => {
            trajectories = data;
            step = 0;
            window.sim.setStepDtSeconds(timeScale);
            window.sim.updateFromUI();
            window.sim.updateLegend();
            initOrUpdateEnergyChart();
            setPaused(true);
            enablePlaybackIfData();
        })
        .catch(error => console.error('Error:', error))
        .finally(() => toggleLoader(false));
    } else {
        // Stream/batch mode
        trajectories = [];
        step = 0;
        window.sim.setStepDtSeconds(timeScale);
        let remaining = continuous ? 0 : (Number.isFinite(numSteps) ? numSteps : 0);
        let currentPositionsKm = posArray;
        let currentVelocitiesKmS = velArray;
        let inflight = false;
        const maxBufferedFrames = 2000; // backpressure threshold

        function runNextBatch() {
            if (inflight) return; // avoid multiple concurrent requests
            // Backpressure: don't fetch if buffered ahead frames are plenty
            const bufferedAhead = trajectories.length - window.sim.getStep();
            if (bufferedAhead > maxBufferedFrames) {
                // Try again later if still playing
                if (!window.sim.isPaused) setTimeout(runNextBatch, 100);
                return;
            }
            // If steps is 0 or negative, treat as infinite stream until user pauses
            const n = (remaining && remaining > 0) ? Math.min(batchSteps, remaining) : batchSteps;
            inflight = true;
            fetch('/simulate_chunk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ masses, positions: currentPositionsKm, velocities: currentVelocitiesKmS, num_steps: n, dt, time_scale: timeScale })
            })
            .then(r => r.json())
            .then(chunk => {
                if (Array.isArray(chunk.trajectory)) {
                    // Append new positions (already in meters)
                    for (const frame of chunk.trajectory) trajectories.push(frame);
                }
                currentPositionsKm = chunk.final_positions_km;
                currentVelocitiesKmS = chunk.final_velocities_km_s;
                if (remaining && remaining > 0) remaining -= n;

                // On first batch, init UI/canvas
                if (trajectories.length > 0 && step === 0) {
                    window.sim.updateFromUI();
                    window.sim.updateLegend();
                    initOrUpdateEnergyChart();
                }
                // Update chart progressively (throttled by batches)
                initOrUpdateEnergyChart();
                // Schedule next batch
                if (!window.sim.isPaused) {
                    setTimeout(runNextBatch, 0);
                } else {
                    toggleLoader(false);
                    enablePlaybackIfData();
                }
            })
            .catch(err => { console.error(err); toggleLoader(false); })
            .finally(() => { inflight = false; });
        }
        // In continuous mode, auto-play
        setPaused(false);
        enablePlaybackIfData();
        const tick = () => {
            if (!window.sim.isPaused) runNextBatch();
            setTimeout(tick, 100); // periodic check to refill buffer
        };
        tick();
    }
}

function stopSimulation() {
    trajectories = [];
    step = 0;
    setup();
}

// --- New UI wiring ---
let energyChart;

function initOrUpdateEnergyChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx || trajectories.length === 0) return;
    const e = window.sim.computeEnergies();
    const labels = e.t.map(sec => (sec / 86400).toFixed(1)); // days
    const datasets = [
        { label: 'Kinetic', data: e.kinetic, borderColor: '#4dabf7', pointRadius: 0 },
        { label: 'Potential', data: e.potential, borderColor: '#ff6b6b', pointRadius: 0 },
        { label: 'Total', data: e.total, borderColor: '#ffd43b', pointRadius: 0 },
    ];
    if (energyChart) {
        energyChart.data.labels = labels;
        energyChart.data.datasets.forEach((ds, i) => ds.data = datasets[i].data);
        energyChart.update('none');
    } else {
        energyChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Time (days)' } },
                    y: { title: { display: true, text: 'Energy (J)' }, ticks: { callback: v => abbreviateNumber(v) } }
                },
                plugins: { legend: { display: true, position: 'bottom' } }
            }
        });
    }
    const insights = document.getElementById('insightsText');
    if (insights) {
        const e0 = e.total[0];
        const eN = e.total[e.total.length - 1];
        const drift = ((eN - e0) / Math.max(1, Math.abs(e0))) * 100;
        insights.innerText = `Energy drift: ${drift.toFixed(3)}% over simulation.`;
    }
}

function abbreviateNumber(value) {
    const suffixes = ['','k','M','B','T'];
    let newValue = value;
    let suffixNum = 0;
    while (Math.abs(newValue) >= 1000 && suffixNum < suffixes.length - 1) {
        newValue /= 1000;
        suffixNum++;
    }
    return `${newValue.toFixed(2)}${suffixes[suffixNum]}`;
}

function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.display = show ? 'flex' : 'none';
}

function setPaused(paused) {
    window.sim.isPaused = paused;
    const btn = document.getElementById('playPauseBtn');
    if (btn) btn.textContent = paused ? 'Play' : 'Pause';
}

function cssColor(c) {
    // Accept named colors and hex; fallback to white
    const d = document.createElement('div');
    d.style.color = c;
    document.body.appendChild(d);
    const rgb = getComputedStyle(d).color;
    document.body.removeChild(d);
    // Convert rgb(a) to hex
    const m = rgb.match(/\d+/g);
    if (!m) return '#ffffff';
    const [r,g,b] = m.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function refreshFollowBodyOptions() {
    const sel = document.getElementById('followBody');
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="-1">None</option>';
    for (let i = 1; i <= numBodies; i++) {
        const opt = document.createElement('option');
        opt.value = String(i - 1);
        opt.textContent = `Body ${i}`;
        sel.appendChild(opt);
    }
    if (prev && +prev < numBodies) sel.value = prev;
}

// Initial wire-up after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Playback controls
    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
        setPaused(!window.sim.isPaused);
    });
    document.getElementById('resetViewBtn')?.addEventListener('click', () => {
        window.sim.resetView();
    });
    // Disable/enable step inputs based on continuous mode
    const continuous = document.getElementById('continuousMode');
    const numStepsEl = document.getElementById('numSteps');
    const batchStepsEl = document.getElementById('batchSteps');
    function refreshStepInputs() {
        const isCont = continuous?.checked;
        if (!numStepsEl || !batchStepsEl) return;
        if (isCont) {
            numStepsEl.setAttribute('disabled', 'true');
            batchStepsEl.removeAttribute('disabled');
        } else {
            numStepsEl.removeAttribute('disabled');
            batchStepsEl.setAttribute('disabled', 'true');
        }
    }
    continuous?.addEventListener('change', refreshStepInputs);
    refreshStepInputs();
    document.getElementById('downloadBtn')?.addEventListener('click', () => {
        if (!trajectories || trajectories.length === 0) return;
        const meta = { masses, colors, stepDtSeconds: window.sim.getStepDtSeconds(), createdAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify({ meta, trajectories }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '3body_trajectories.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Follow body select
    document.getElementById('followBody')?.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        window.sim.setFollowIndex(isNaN(idx) ? -1 : idx);
    });

    // Zoom slider updates manual scale
    document.getElementById('scaleSlider')?.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        document.getElementById('scaleValue').textContent = String(v);
        window.sim.setManualScale(v);
    });
});

function enablePlaybackIfData() {
    const btn = document.getElementById('playPauseBtn');
    if (btn && trajectories && trajectories.length > 0) {
        btn.disabled = false;
    }
}