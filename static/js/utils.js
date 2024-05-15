function updateScale(value) {
    manualScale = parseFloat(value);
    document.getElementById('scaleValue').textContent = value;
}

function displayDebugInfo() {
    let debugInfo = `Window Size: ${width} x ${height}<br>`;
    debugInfo += `Current Step: ${step}<br>`;
    for (let i = 0; i < numBodies; i++) {
        const pos = trajectories.length > 0 && step < trajectories.length ? trajectories[step][i] : positions[i];
        if (pos) {
        debugInfo += `Body ${i + 1} Position: x=${(pos[0] * positionScale).toFixed(2)}, y=${(pos[1] * positionScale).toFixed(2)}, z=${(pos[2] * positionScale).toFixed(2)}<br>`;
        }
    }
    const debugInfoDiv = document.getElementById('debug-info');
    debugInfoDiv.innerHTML = debugInfo;
    debugInfoDiv.style.display = 'block';
}
