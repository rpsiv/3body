const defaultColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'magenta'];
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
                colorCell.innerHTML = `<input type="text" class="form-control" value="${body.color}" id="color${numBodies}">`;
                actionCell.innerHTML = `<button type="button" class="btn btn-danger" onclick="removeRow(this)">Remove</button>`;
        
                positions.push(body.position);
                velocities.push(body.velocity);
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
    const massCell = row.insertCell(1);
    const positionCell = row.insertCell(2);
    const velocityCell = row.insertCell(3);
    const colorCell = row.insertCell(4);
    const actionCell = row.insertCell(5);
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
        parseFloat(document.getElementById(`vel${i}x`).value) * velocityScale,
        parseFloat(document.getElementById(`vel${i}y`).value) * velocityScale,
        parseFloat(document.getElementById(`vel${i}z`).value) * velocityScale,
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

const dt = 1; // Time step in seconds

fetch('/simulate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ masses, positions: posArray, velocities: velArray, num_steps: numSteps, dt, time_scale: timeScale })
})
.then(response => response.json())
.then(data => {
    console.log("Received simulation data:", data);
    trajectories = data;
    step = 0;  // Reset step counter for new simulation
    setup();  // Re-setup the canvas for new simulation
})
.catch(error => console.error('Error:', error));
}

function stopSimulation() {
trajectories = [];
step = 0;
setup();
}