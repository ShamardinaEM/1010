export const GRID_SIZE = 10;

export const createEmptyGrid = () => Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(0));

const FIGURES = [
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1, 1]],
  [[1], [1], [1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 0], [1, 1], [1, 0]],
  [[0, 1], [1, 1], [0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 0]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  [[1, 0], [1, 0]],
  [[0, 0, 1], [0, 1, 0], [1, 0, 0]]
];

const COLORS = [
  "#FF6B6B", 
  "#4ECDC4", 
  "#FFD166", 
  "#06D6A0", 
  "#A051F2", 
  "#FF8A5B", 
  "#5778FF" 
];

export const generateRandomFigures = (count = 3) => {
  const figures = [];
  for (let i = 0; i < count; i++) {
    const shape = FIGURES[Math.floor(Math.random() * FIGURES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    figures.push({ shape, color });
  }
  return figures;
};
