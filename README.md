# N-Body Gravity Simulation (Web)

Interactive, web-based N-body gravity simulator built with Flask (Python), p5.js (WebGL), and Chart.js. Explore preconfigured scenarios (from classic 3-body to a simplified solar system) or create your own by editing masses, positions, and velocities. Visualize trajectories, vectors, and energy over time with a modern, responsive UI.

## Key Features

- **Modern UI**
  - Responsive two-panel layout (Bootstrap 5)
  - Play/Pause, Reset View, and JSON export (Download Data)
  - Presets selector and editable bodies table (add/remove bodies, color pickers)
- **Physics Visualization**
  - 3D WebGL rendering with orbit camera (rotate/pan/zoom when hovering over the canvas)
  - Trails with adjustable length
  - Axes toggle
  - Velocity and force vectors on bodies (screen-space scaled for visibility at any zoom)
  - Center on center-of-mass (COM) option
  - COM marker (grey), scaled relative to body sizes
  - Follow a specific body, or keep scene centered on COM
- **Physics Insights**
  - Energy chart (kinetic, potential, total) using Chart.js
  - Energy drift indicator over the simulation
- **Simulation Modes**
  - Fixed-length runs: compute a specified number of steps server-side and then play
  - Continuous mode: stream batches of steps from the server while playing
  - Backpressure to avoid unbounded buffering; only one request in flight; pause halts streaming

## Units and Conventions

- Mass input unit: 10^24 kg
- Position input unit: km
- Velocity input unit: km/s
- The server converts to SI units (kg, m, m/s) for physics, then returns trajectories in meters
- Rendering uses a dynamic scale factor so typical systems are visible without manual tuning

## Presets

- Solar System (simplified): Sun + eight planets
- Classic 3-Body Problem
- Figure-Eight Orbit (3-body choreography)
- Random 3-Body Interaction
- Hierarchical Triple System

You can also add/remove bodies and set custom initial conditions.

## Controls

- Left panel
  - Presets and Add body
  - Steps (fixed-length mode), Time scale (seconds per second)
  - Continuous mode + Steps per batch (used only in continuous mode)
  - Zoom slider (manual multiplier)
  - Toggles: Debug, Center on COM, Trails, Axes, Velocity vectors, Force vectors, Show center of mass
  - Follow body: lock view to a specific body
  - Physics insights: energy chart and drift
- Top bar
  - Play/Pause (disabled until frames are available)
  - Reset View
  - Download Data (exports JSON with metadata and trajectories)
- Canvas (hover to control)
  - Rotate: drag with left mouse
  - Pan: drag with right mouse (or two-finger drag on trackpad)
  - Zoom: scroll

## Running Locally

1. Clone and install
   ```sh
   git clone https://github.com/rpsiv/3body.git
   cd 3body
   pip install -r requirements.txt
   ```

2. Start the app
   ```sh
   python app.py
   ```
   Then open `http://127.0.0.1:5000` in your browser.

Notes:
- The app uses CDN scripts for p5.js and Chart.js, so no extra JS install steps are needed.
- If you use `flask run`, set `FLASK_APP=app.py`.

## How It Works

- Server: Python/Flask computes gravitational interactions with a simple explicit integrator
  - `POST /simulate`: compute a full run for `num_steps`, return all positions (in meters)
  - `POST /simulate_chunk`: compute a batch of steps and return the new frames plus the updated state (for streaming)
- Client: p5.js renders 3D positions, with draw-time options for trails, axes, vectors, and COM
- Chart.js plots energies derived from returned frames

## Known Limitations / Roadmap

- The integrator is explicit (Euler-like). Energy drift can be non-negligible for long runs or large time scales
  - Roadmap: add symplectic/RK4 integrators and adaptive step sizing
- No persistence of custom scenarios yet
  - Roadmap: save/load scenarios, shareable URLs
- Streaming currently uses batch polling
  - Roadmap: Server-Sent Events or WebSockets for event-driven streaming
- Large systems (many bodies or very long runs) will stress the browser; use continuous mode with moderate batch sizes

## Development Notes

This project involved iterative improvements to UI/UX and simulation stability. See `conversation.md` for design decisions and history.

Contributions welcome! Please open issues with reproducible steps and include your browser/OS info.