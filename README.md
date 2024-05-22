
# 3-Body Problem Simulation

This project simulates the 3-body problem using a web-based interface built with Flask and p5.js. It allows users to explore different scenarios involving the gravitational interaction between three celestial bodies. Users can choose pre-configured setups or define their own initial conditions.

## Features

- **Pre-configured Setups**: Quickly load scenarios such as the Solar System, classic 3-body problem, figure-eight orbit, random 3-body interaction, and hierarchical triple system.
- **Custom Initial Conditions**: Define your own masses, positions, velocities, and colors for up to three bodies.
- **Visualization**: View the simulation in a 3D space with trails showing the paths of the bodies.
- **Debug Information**: Option to display debug information including the current step and positions of the bodies.

## Usage

1. **Clone the repository**:
   ```sh
   git clone https://github.com/rpsiv/3body.git
   cd 3body
   ```

2. **Install the dependencies**:
   ```sh
   pip install -r requirements.txt
   ```

3. **Run the Flask application**:
   ```sh
   flask run
   ```

4. **Open your browser** and navigate to `http://127.0.0.1:5000`.

5. **Choose a setup** from the dropdown menu or define your own initial conditions using the form.

6. **Run the simulation** by clicking the "Run Simulation" button.

## Development

This project was developed with the assistance of ChatGPT-4. The process involved iterative coding and debugging sessions, where the AI provided guidance on structuring the code, identifying and fixing bugs, and optimizing the simulation parameters.  The initial prompt was: 

`Write a python program which can simulate the 3 body problem. Have it take in masses and number of bodies and their initial stating locations and vectors. It should be a web user interface which displays the motions of the objects and takes the initial inputs.`

See the `conversation.md` to see the conversation, the generated code blocks are omitted for brevity but the full transcript can be provided

### Key Development Steps

1. **Initial Setup**: Flask application and basic HTML structure.
2. **Adding p5.js**: Integrating p5.js for visualization.
3. **Defining Physics**: Implementing the physics for the 3-body problem.
4. **UI Enhancements**: Improving the UI with Bootstrap and adding features like pre-configured setups.
5. **Debugging**: Iteratively fixing bugs and optimizing the simulation parameters.
6. **Final Touches**: Adding debug information, trails, and ensuring scalability for different scenarios.

### Challenges and Solutions

- **Initial Condition Stability**: Ensuring that the 3-body scenarios have stable initial conditions to avoid chaotic behavior. This was achieved by carefully setting the initial positions and velocities based on known solutions.
- **Scalability**: Ensuring the simulation runs smoothly for both small and large distances. Scaling factors were adjusted accordingly.
- **UI/UX**: Enhancing the user experience by making the interface intuitive and responsive.

## Pre-configured Setups

The following pre-configured setups are available:

1. **Solar System**: A simplified model of the solar system including the Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
2. **Classic 3-Body Problem**: Three bodies forming an equilateral triangle with initial velocities set to maintain a stable orbit.
3. **Figure-Eight Orbit**: Three bodies following a figure-eight trajectory.
4. **Random 3-Body Interaction**: Random initial positions and velocities for three bodies.
5. **Hierarchical Triple System**: A larger body with two smaller bodies orbiting it.

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request.

