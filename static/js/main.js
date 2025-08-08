let numBodies = 0;
let trajectories = [];
let masses = [];
let colors = [];
let manualScale = 1;
let step = 0;
let trails = [];
// For debug and pre-sim display
const positions = [];
const velocities = [];

// Rendering/scales
const sizeFactor = 0.005; // visual sphere size scaling
const positionScale = 1e-9; // meters -> rendering units
let scaleFactor = 1; // auto fit based on initial extent

// Playback
let isPaused = true;
const stepsPerFrame = 1;
// Time step per simulation frame (seconds). Set when simulation starts.
let stepDtSeconds = 1;

// UI toggles (updated by UI events)
let showTrailsFlag = true;
let showAxesFlag = true;
let showVelFlag = false;
let showForceFlag = false;
let centerOnCOMFlag = false;
let followBodyIndex = -1; // -1 means none
let trailMaxLength = 10000;
let showCOMFlag = false;

// DOM measurements
let canvas;
let canvasHovered = false;

// Utility math helpers working in meters
const G = 6.67430e-11;

function setup() {
  const container = document.getElementById('canvas-container');
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 600;
  if (!canvas) {
    canvas = createCanvas(w, h, WEBGL);
    canvas.parent('canvas-container');
    frameRate(60);
    // Hover tracking to gate orbit controls
    const containerEl = document.getElementById('canvas-container');
    if (containerEl) {
      containerEl.addEventListener('mouseenter', () => { canvasHovered = true; });
      containerEl.addEventListener('mouseleave', () => { canvasHovered = false; });
    }
  } else {
    resizeCanvas(w, h);
  }

  trails = Array(numBodies).fill(null).map(() => []);

  // Fit scene: find max initial distance from origin to set scale
  let maxDistance = 1;
  if (trajectories.length > 0) {
    for (let i = 0; i < numBodies; i++) {
      const pos = trajectories[0][i]; // meters
      const distance = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
      if (distance > maxDistance) maxDistance = distance;
    }
  }
  // Place roughly within 40% of min(viewport width,height)
  const screenUnits = Math.min(w, h) * 0.4;
  scaleFactor = screenUnits / (maxDistance * positionScale);
}

function windowResized() {
  setup();
}

function drawAxes(len = 1) {
  push();
  strokeWeight(1);
  // X - red
  stroke('red');
  line(0, 0, 0, len, 0, 0);
  // Y - green
  stroke('green');
  line(0, 0, 0, 0, len, 0);
  // Z - blue
  stroke('blue');
  line(0, 0, 0, 0, 0, len);
  pop();
}

function getCOMOffset(currentPositionsMeters) {
  if (!centerOnCOMFlag && followBodyIndex < 0) return { x: 0, y: 0, z: 0 };
  const massesKg = masses.map(m => m * 1e24);
  if (followBodyIndex >= 0 && currentPositionsMeters[followBodyIndex]) {
    const p = currentPositionsMeters[followBodyIndex];
    return { x: -p[0], y: -p[1], z: -p[2] };
  }
  let sumM = 0, cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < currentPositionsMeters.length; i++) {
    const m = massesKg[i];
    if (!isFinite(m)) continue;
    const p = currentPositionsMeters[i];
    sumM += m;
    cx += m * p[0];
    cy += m * p[1];
    cz += m * p[2];
  }
  if (sumM === 0) return { x: 0, y: 0, z: 0 };
  return { x: -(cx / sumM), y: -(cy / sumM), z: -(cz / sumM) };
}

function approximateVelocity(currentIdx, bodyIdx) {
  if (currentIdx <= 0 || currentIdx >= trajectories.length) return [0, 0, 0];
  const p = trajectories[currentIdx][bodyIdx];
  const pPrev = trajectories[currentIdx - 1][bodyIdx];
  const dt = stepDtSeconds; // seconds
  return [(p[0] - pPrev[0]) / dt, (p[1] - pPrev[1]) / dt, (p[2] - pPrev[2]) / dt];
}

function computeNetForceMeters(currentIdx, bodyIdx) {
  // F = sum G m1 m2 / r^2 * r_hat
  const massesKg = masses.map(m => m * 1e24);
  const pi = trajectories[currentIdx][bodyIdx];
  let fx = 0, fy = 0, fz = 0;
  for (let j = 0; j < numBodies; j++) {
    if (j === bodyIdx) continue;
    const pj = trajectories[currentIdx][j];
    const rx = pj[0] - pi[0];
    const ry = pj[1] - pi[1];
    const rz = pj[2] - pi[2];
    const r = Math.hypot(rx, ry, rz);
    if (r === 0) continue;
    const fMag = (G * massesKg[bodyIdx] * massesKg[j]) / (r * r);
    fx += fMag * (rx / r);
    fy += fMag * (ry / r);
    fz += fMag * (rz / r);
  }
  return [fx, fy, fz];
}

function draw() {
  background('#0a0f1a');
  if (canvasHovered) {
    orbitControl();
  }

  // Read UI toggles cheaply each frame
  showAxesFlag = document.getElementById('showAxes')?.checked ?? showAxesFlag;
  showTrailsFlag = document.getElementById('showTrails')?.checked ?? showTrailsFlag;
  showVelFlag = document.getElementById('showVel')?.checked ?? showVelFlag;
  showForceFlag = document.getElementById('showForce')?.checked ?? showForceFlag;
  centerOnCOMFlag = document.getElementById('centerOnCOM')?.checked ?? centerOnCOMFlag;
  showCOMFlag = document.getElementById('showCOM')?.checked ?? showCOMFlag;
  const trailLenInput = document.getElementById('trailLength');
  if (trailLenInput) trailMaxLength = parseInt(trailLenInput.value, 10) || trailMaxLength;

  if (document.getElementById('showDebug')?.checked) {
    displayDebugInfo();
  } else {
    const dbg = document.getElementById('debug-info');
    if (dbg) dbg.style.display = 'none';
  }

  scale(scaleFactor * manualScale);

  if (trajectories.length === 0) return;
  const currentIdx = Math.min(step, trajectories.length - 1);
  const currentPositionsMeters = trajectories[currentIdx];

  // Centering transform (meters -> rendering units)
  const offset = getCOMOffset(currentPositionsMeters);
  translate(offset.x * positionScale, offset.y * positionScale, offset.z * positionScale);

  if (showAxesFlag) {
    const axesLen = 1e9 * positionScale; // 1e9 m in render units
    drawAxes(axesLen);
  }

  // Draw bodies and build trails
  for (let i = 0; i < numBodies; i++) {
    const pos = currentPositionsMeters[i];
    if (!pos) continue;
    if (!trails[i]) trails[i] = [];
    trails[i].push([...pos]);
    if (trails[i].length > trailMaxLength) trails[i].shift();

    const radius = Math.cbrt(masses[i]) * sizeFactor;
    push();
    translate(pos[0] * positionScale, pos[1] * positionScale, pos[2] * positionScale);
    noStroke();
    fill(colors[i] || 'white');
    sphere(radius);

    // Velocity vector
    if (showVelFlag && currentIdx > 0) {
      const v = approximateVelocity(currentIdx, i); // m/s
      const vMag = Math.hypot(v[0], v[1], v[2]) || 1;
      const dir = [v[0] / vMag, v[1] / vMag, v[2] / vMag];
      // Aim for ~40px arrow length in screen space
      const px = 40;
      const worldUnits = px / (scaleFactor * manualScale); // render units before scale()
      const arrowLenMeters = worldUnits / positionScale;
      stroke(255);
      strokeWeight(1);
      line(0, 0, 0, dir[0] * arrowLenMeters * positionScale, dir[1] * arrowLenMeters * positionScale, dir[2] * arrowLenMeters * positionScale);
    }

    // Force vector (screen-space-scaled so it stays visible at various zooms)
    if (showForceFlag) {
      const f = computeNetForceMeters(currentIdx, i); // N
      const fMag = Math.hypot(f[0], f[1], f[2]) || 1;
      const dir = [f[0] / fMag, f[1] / fMag, f[2] / fMag];
      // Aim for ~40px arrow length in screen space
      const px = 40;
      const worldUnits = px / (scaleFactor * manualScale); // render units before scale()
      const arrowLenMeters = worldUnits / positionScale;
      stroke(200, 100, 255);
      strokeWeight(1);
      line(0, 0, 0, dir[0] * arrowLenMeters * positionScale, dir[1] * arrowLenMeters * positionScale, dir[2] * arrowLenMeters * positionScale);
    }
    pop();
  }

  // Draw trails after bodies so they appear beneath spheres slightly
  if (showTrailsFlag) {
    for (let i = 0; i < trails.length; i++) {
      if (!trails[i] || trails[i].length < 2) continue;
      noFill();
      stroke(colors[i] || '#aaa');
      beginShape();
      for (let j = 0; j < trails[i].length; j++) {
        const p = trails[i][j];
        vertex(p[0] * positionScale, p[1] * positionScale, p[2] * positionScale);
      }
      endShape();
    }
  }

  // Draw center of mass marker after trails so it's on top
  if (showCOMFlag) {
    const massesKg = masses.map(m => m * 1e24);
    let sumM = 0, cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < numBodies; i++) {
      const m = massesKg[i];
      if (!isFinite(m)) continue;
      const p = currentPositionsMeters[i];
      sumM += m;
      cx += m * p[0];
      cy += m * p[1];
      cz += m * p[2];
    }
    if (sumM > 0) {
      const com = [cx / sumM, cy / sumM, cz / sumM];
      // Size COM roughly comparable to average body sphere size
      let radiusSum = 0;
      for (let i = 0; i < numBodies; i++) {
        radiusSum += Math.cbrt(masses[i]) * sizeFactor;
      }
      const meanRadius = numBodies > 0 ? radiusSum / numBodies : 6;
      push();
      translate(com[0] * positionScale, com[1] * positionScale, com[2] * positionScale);
      noStroke();
      fill(180); // grey
      sphere(meanRadius);
      pop();
    }
  }

  if (!isPaused && step < trajectories.length - 1) {
    step += stepsPerFrame;
  }
}

// Expose helpers used by UI
function resetView() {
  manualScale = 1;
  setup();
}

function updateLegend() {
  const legend = document.getElementById('legend');
  if (!legend) return;
  let html = '';
  for (let i = 0; i < numBodies; i++) {
    const color = colors[i] || '#ccc';
    const label = `Body ${i + 1}`;
    html += `<div><span class="legend-dot" style="background:${color}"></span>${label}</div>`;
  }
  legend.innerHTML = html;
}

function computeEnergies() {
  // Returns arrays for plotting; heavy but fine for small numBodies
  const massesKg = masses.map(m => m * 1e24);
  const kinetic = [];
  const potential = [];
  const total = [];
  const t = [];
  const nSteps = trajectories.length;
  for (let k = 0; k < nSteps; k++) {
    let KE = 0;
    let PE = 0;
    for (let i = 0; i < numBodies; i++) {
      // Approximate velocity
      const v = k === 0 ? [0, 0, 0] : [
        (trajectories[k][i][0] - trajectories[k - 1][i][0]) / stepDtSeconds,
        (trajectories[k][i][1] - trajectories[k - 1][i][1]) / stepDtSeconds,
        (trajectories[k][i][2] - trajectories[k - 1][i][2]) / stepDtSeconds,
      ];
      const v2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
      KE += 0.5 * massesKg[i] * v2;
    }
    for (let i = 0; i < numBodies; i++) {
      for (let j = i + 1; j < numBodies; j++) {
        const dx = trajectories[k][j][0] - trajectories[k][i][0];
        const dy = trajectories[k][j][1] - trajectories[k][i][1];
        const dz = trajectories[k][j][2] - trajectories[k][i][2];
        const r = Math.hypot(dx, dy, dz);
        if (r > 0) PE += -G * massesKg[i] * massesKg[j] / r;
      }
    }
    kinetic.push(KE);
    potential.push(PE);
    total.push(KE + PE);
    t.push(k * stepDtSeconds);
  }
  return { kinetic, potential, total, t };
}

// Make available to other scripts
window.sim = {
  get isPaused() { return isPaused; },
  set isPaused(v) { isPaused = v; },
  setFollowIndex(idx) { followBodyIndex = idx; },
  setStepDtSeconds(dt) { stepDtSeconds = dt; },
  updateLegend,
  resetView,
  computeEnergies,
  setManualScale(v) { manualScale = v; },
  updateFromUI() { setup(); },
  getStepDtSeconds() { return stepDtSeconds; },
  getStep() { return step; },
};