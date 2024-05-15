let numBodies = 0;
let trajectories = [];
let masses = [];
let colors = [];
let manualScale = 1;
let step = 0;
const sizeFactor = 0.005; // Size factor to make the bodies more visible
const positionScale = 1e-9; // Scaling factor for positions
const velocityScale = 1; // No scaling applied to velocity in this context
const stepsPerFrame = 1;
const positions = [];
const velocities = [];

function setup() {
    createCanvas(800, 800, WEBGL);
    frameRate(60); // Set frame rate to 60 fps
    trails = Array(numBodies).fill().map(() => []);

    // Calculate the initial scale factor based on the max distance
    let maxDistance = 0;
    if (trajectories.length > 0) {
        for (let i = 0; i < numBodies; i++) {
            const pos = trajectories[0][i];
            const distance = dist(0, 0, 0, pos[0], pos[1], pos[2]);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
    }
    scaleFactor = 400 / (maxDistance * positionScale); // Correctly calculate the scale factor
    console.log("maxDistance " + maxDistance);
    console.log("scaleFactor " + scaleFactor);
}

function draw() {
    background(220);
    orbitControl();

    if (document.getElementById('showDebug').checked) {
        displayDebugInfo();
    } else {
        document.getElementById('debug-info').style.display = 'none';
    }

    scale(scaleFactor * manualScale);

    if (trajectories.length > 0 && step < trajectories.length) {
        for (let i = 0; i < trajectories[step].length; i++) {
            const pos = trajectories[step][i];
            trails[i].push([...pos]);
            if (trails[i].length > 10000) {
                trails[i].shift(); // Keep only the latest 100 positions
            }

            const radius = Math.cbrt(masses[i]) * sizeFactor; // Scale the size based on mass
            push();
            translate(pos[0] * positionScale, pos[1] * positionScale, pos[2] * positionScale); // Apply scaling for drawing
            noStroke(); // Disable the wireframe stroke
            fill(colors[i]); // Set color for each body
            sphere(radius);
            pop();
        }

        // Draw trails
        for (let i = 0; i < trails.length; i++) {
            noFill();
            stroke(colors[i]); // Set color for trail
            beginShape();
            for (let j = 0; j < trails[i].length; j++) {
                const pos = trails[i][j];
                vertex(pos[0] * positionScale, pos[1] * positionScale, pos[2] * positionScale); // Apply scaling for drawing
            }
            endShape();
        }

        step += stepsPerFrame; // Increment step by stepsPerFrame
    } else if (step >= trajectories.length && trajectories.length > 0) {
        // If the simulation is complete, keep the last frame up
        for (let i = 0; i < trajectories[step - 1].length; i++) {
            const pos = trajectories[step - 1][i];

            const radius = Math.cbrt(masses[i]) * sizeFactor; // Scale the size based on mass
            push();
            translate(pos[0] * positionScale, pos[1] * positionScale, pos[2] * positionScale); // Apply scaling for drawing
            noStroke(); // Disable the wireframe stroke
            fill(colors[i]); // Set color for each body
            sphere(radius);
            pop();
        }

        // Draw trails
        for (let i = 0; i < trails.length; i++) {
            noFill();
            stroke(colors[i]); // Set color for trail
            beginShape();
            for (let j = 0; j < trails[i].length; j++) {
                const pos = trails[i][j];
                vertex(pos[0] * positionScale, pos[1] * positionScale, pos[2] * positionScale); // Apply scaling for drawing
            }
            endShape();
        }
    }
}