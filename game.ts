type Board = Array<Array<0 | 1>>;

interface BoardOptions {
  width?: number;
  height?: number;
  liveness?: number;
}

const createBoard = (options?: BoardOptions): Board => {
  options = options ?? {};
  const { width = 20, height = width, liveness = 0.5 } = options;
  const board = Array.from({ length: height }, () => {
    return Array.from({ length: width }, () => {
      return (Math.random() < liveness) ? 1 : 0;
    });
  });
  return board;
};

const countNeighbors = (board: Board, row: number, column: number): number => {
  const north = board[row - 1]?.[column] ?? 0;
  const northeast = board[row - 1]?.[column + 1] ?? 0;
  const east = board[row]?.[column + 1] ?? 0;
  const southeast = board[row + 1]?.[column + 1] ?? 0;
  const south = board[row + 1]?.[column] ?? 0;
  const southwest = board[row + 1]?.[column - 1] ?? 0;
  const west = board[row]?.[column - 1] ?? 0;
  const northwest = board[row - 1]?.[column - 1] ?? 0;

  return north + northeast + east + southeast + south + southwest + west +
    northwest;
};

const tick = (board: Board): Board => {
  return board.map((row, rowNum) => {
    return row.map((cell, columnNum) => {
      const neighbors = countNeighbors(board, rowNum, columnNum);
      if (neighbors === 3 || (cell && neighbors === 2)) {
        return 1;
      }
      return 0;
    });
  });
};

export const play = (board?: Board | BoardOptions) => {
  let b = Array.isArray(board) ? board : createBoard(board);
  let canvas = document.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  const cellSize = 40;
  canvas.height = b.length * cellSize;
  canvas.width = b[0].length * cellSize;
  const ctx = canvas.getContext("2d");

  const render = (grid: Board) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        ctx.beginPath();
        ctx.rect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize,
        );
        ctx.fillStyle = cell ? "#000000" : "#ffffff";
        ctx.fill();
      });
    });
  };

  let lastTime = performance.now();
  // TODO: Make this an option
  const fps = 1;
  const loop = (time) => {
    // Slow down the animation to the desired speed.
    if (fps && (time - lastTime) < (1000 / fps)) {
      requestAnimationFrame(loop);
      return;
    }
    lastTime = time;
    b = tick(b);
    render(b);
    requestAnimationFrame(loop);
  };

  render(b);
  requestAnimationFrame(loop);
};

play();
