from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

# Constants
G = 6.67430e-11  # gravitational constant in m^3 kg^-1 s^-2

def calculate_forces(masses, positions):
    num_bodies = len(masses)
    forces = np.zeros((num_bodies, 3), dtype=np.float64)

    for i in range(num_bodies):
        for j in range(num_bodies):
            if i != j:
                r = positions[j] - positions[i]
                distance = np.linalg.norm(r)
                if distance == 0:
                    continue
                force_magnitude = G * masses[i] * masses[j] / distance**2
                force_direction = r / distance
                forces[i] += force_magnitude * force_direction

    return forces

def update_positions(masses, positions, velocities, dt):
    forces = calculate_forces(masses, positions)
    accelerations = forces / masses[:, np.newaxis]
    velocities += accelerations * dt
    positions += velocities * dt
    return positions, velocities

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    masses = np.array(data['masses'], dtype=np.float64) * 1e24  # convert to kg
    positions = np.array(data['positions'], dtype=np.float64) * 1e3  # convert to meters
    velocities = np.array(data['velocities'], dtype=np.float64) * 1e3  # convert to meters/second
    num_steps = data['num_steps']
    dt = data['dt'] * data['time_scale']

    # Validate shapes
    if not (len(masses.shape) == 1 and positions.shape[1] == 3 and velocities.shape[1] == 3):
        return jsonify({"error": "Invalid shapes for masses/positions/velocities"}), 400
    if not (positions.shape[0] == velocities.shape[0] == masses.shape[0]):
        return jsonify({"error": "Mismatch: masses, positions, and velocities must have the same number of bodies"}), 400

    print(f"Received data: {data}")

    trajectory = []
    for step in range(num_steps):
        positions, velocities = update_positions(masses, positions, velocities, dt)
        trajectory.append(positions.copy().tolist())

    print("Simulation complete")
    return jsonify(trajectory)


@app.route('/simulate_chunk', methods=['POST'])
def simulate_chunk():
    """Compute a chunk of steps and return both the trajectory in meters and the final state in km/km/s.

    Request JSON:
      - masses: [M_i in 1e24 kg]
      - positions: [[x,y,z] in km]
      - velocities: [[vx,vy,vz] in km/s]
      - num_steps: int
      - dt: base seconds per step (will be multiplied by time_scale)
      - time_scale: seconds per second scaling
    """
    data = request.json
    masses = np.array(data['masses'], dtype=np.float64) * 1e24
    positions = np.array(data['positions'], dtype=np.float64) * 1e3
    velocities = np.array(data['velocities'], dtype=np.float64) * 1e3
    num_steps = int(data['num_steps'])
    dt = float(data['dt']) * float(data['time_scale'])

    # Validate shapes
    if not (len(masses.shape) == 1 and positions.shape[1] == 3 and velocities.shape[1] == 3):
        return jsonify({"error": "Invalid shapes for masses/positions/velocities"}), 400
    if not (positions.shape[0] == velocities.shape[0] == masses.shape[0]):
        return jsonify({"error": "Mismatch: masses, positions, and velocities must have the same number of bodies"}), 400

    trajectory = []
    for _ in range(num_steps):
        positions, velocities = update_positions(masses, positions, velocities, dt)
        trajectory.append(positions.copy().tolist())

    # Convert final state back to km and km/s for client to chain
    final_positions_km = (positions / 1e3).tolist()
    final_velocities_km_s = (velocities / 1e3).tolist()

    return jsonify({
        'trajectory': trajectory,
        'final_positions_km': final_positions_km,
        'final_velocities_km_s': final_velocities_km_s,
    })

if __name__ == '__main__':
    app.run(debug=True)