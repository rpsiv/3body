# 3-Body Problem Simulation

This project is a web-based simulation of the 3-body problem using p5.js and Flask. The simulation allows users to input the parameters for multiple celestial bodies and visualize their interactions under gravitational forces.

## Features

- Add up to 9 default celestial bodies including the Sun and planets from Mercury to Neptune.
- Customize the mass, position, velocity, and color of each body.
- Adjust the number of simulation steps and the time scale for the simulation.
- Visualize the paths of celestial bodies with color-coded trails.
- Toggle debug information to show detailed simulation data.

## Technologies Used

- **Frontend**: HTML, JavaScript, p5.js, Bootstrap
- **Backend**: Python, Flask

## Getting Started

### Prerequisites

- Python 3.x
- Flask

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/3-body-problem-simulation.git
    cd 3-body-problem-simulation
    ```

2. Install the required Python packages:
    ```sh
    pip install flask numpy
    ```

3. Run the Flask app:
    ```sh
    python app.py
    ```

4. Open your web browser and navigate to `http://127.0.0.1:5000`.

## Usage

1. **Add Bodies**: Click "Add Body" to add a new row in the table. The first 9 bodies added will have default values corresponding to the Sun and planets from Mercury to Neptune.
2. **Customize Parameters**: Enter the mass, position, velocity, and color for each body.
3. **Adjust Simulation Settings**: Set the number of simulation steps and the time scale (seconds per second).
4. **Run Simulation**: Click "Run Simulation" to start the simulation. The paths of the bodies will be displayed on the canvas.
5. **Toggle Debug Data**: Check the "Show Debug Data" checkbox to display detailed simulation data.

## Example

Here's an example of how the input table might look with the default values:

| Body  | Mass (10^24 kg) | Position (x, y, z in km)     | Velocity (vx, vy, vz in km/s) | Color  | Action   |
|-------|------------------|------------------------------|-------------------------------|--------|----------|
| Body 1| 1989000          | 0, 0, 0                      | 0, 0, 0                       | yellow | Remove   |
| Body 2| 0.330            | 57910000, 0, 0               | 0, 47.87, 0                   | grey   | Remove   |
| Body 3| 4.87             | 108200000, 0, 0              | 0, 35.02, 0                   | orange | Remove   |
| Body 4| 5.97             | 149600000, 0, 0              | 0, 29.78, 0                   | blue   | Remove   |
| Body 5| 0.642            | 227940000, 0, 0              | 0, 24.07, 0                   | red    | Remove   |
| Body 6| 1898             | 778330000, 0, 0              | 0, 13.07, 0                   | brown  | Remove   |
| Body 7| 568              | 1429400000, 0, 0             | 0, 9.69, 0                    | yellow | Remove   |
| Body 8| 86.8             | 2870990000, 0, 0             | 0, 6.81, 0                    | cyan   | Remove   |
| Body 9| 102              | 4504300000, 0, 0             | 0, 5.43, 0                    | blue   | Remove   |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.