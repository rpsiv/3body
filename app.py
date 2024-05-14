from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

# Constants
G = 6.67430e-11  # gravitational constant

def calculate_forces(masses, positions):
    num_bodies = len(masses)
    forces = np.zeros((num_bodies, 3), dtype=np.float64)

    for i in range(num_bodies):
        for j in range(num_bodies):
            if i != j:
                r = positions[j] - positions[i]
                distance = np.linalg.norm(r)
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
    masses = np.array(data['masses'], dtype=np.float64)
    positions = np.array(data['positions'], dtype=np.float64)
    velocities = np.array(data['velocities'], dtype=np.float64)
    num_steps = data['num_steps']
    dt = data['dt']

    print(f"Received data: {data}")

    trajectory = []
    for step in range(num_steps):
        positions, velocities = update_positions(masses, positions, velocities, dt)
        trajectory.append(positions.copy().tolist())

    print("Simulation complete")
    return jsonify(trajectory)

if __name__ == '__main__':
    app.run(debug=True)