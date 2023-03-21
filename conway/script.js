const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 10;
const ROWS = canvas.height / CELL_SIZE;
const COLS = canvas.width / CELL_SIZE;

// Create a 2D array to store the state of each cell
let cells = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => Math.random() < 0.5)
);

let speed = 100; // Default speed: 100ms per frame

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each cell
  cells.forEach((row, i) =>
    row.forEach((alive, j) => {
      if (alive) {
        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    })
  );
}

function update() {
  // Create a new 2D array to hold the updated state of each cell
  let newCells = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => false)
  );

  // Iterate over each cell
  cells.forEach((row, i) =>
    row.forEach((alive, j) => {
      // Count the number of live neighbors
      let neighbors = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di !== 0 || dj !== 0) {
            let ni = i + di;
            let nj = j + dj;
            if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS) {
              neighbors += cells[ni][nj] ? 1 : 0;
            }
          }
        }
      }

      // Apply the rules of the Game of Life to update the state of the cell
      if (alive && (neighbors === 2 || neighbors === 3)) {
        newCells[i][j] = true;
      } else if (!alive && neighbors === 3) {
        newCells[i][j] = true;
      }
    })
  );

  // Update the state of the cells
  cells = newCells;
}

// Start the animation loop
setInterval(() => {
  update();
  draw();
}, speed);

// Change the speed with a slider
const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = 1;
speedSlider.max = 1000;
speedSlider.value = speed;
speedSlider.oninput = () => {
  speed = speedSlider.value;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    update();
    draw();
  }, speed);
};
document.body.appendChild(speedSlider);

