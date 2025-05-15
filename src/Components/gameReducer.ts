import {
  generateRandomFigures,
  createEmptyGrid,
  GRID_SIZE,
  MAX_REFRESHES,
} from "./constants";

export interface FigureData {
  shape: number[][];
  color: string;
}

export interface GameState {
  grid: number[][];
  availableFigures: FigureData[];
  nextFigure: FigureData;
  refreshCount: number;
  score: number;
  isGameOver: boolean;
  timerResetKey: number;
}

export type GameAction =
  | {
      type: "PLACE_FIGURE";
      payload: {
        row: number;
        col: number;
        figure: number[][];
      };
    }
  | { type: "UPDATE_GRID"; payload: number[][] }
  | { type: "UPDATE_SCORE"; payload: number }
  | { type: "UPDATE_FIGURES"; payload: FigureData[] }
  | { type: "UPDATE_NEXT_FIGURE"; payload: FigureData }
  | { type: "RESET_TIMER" }
  | { type: "REFRESH_FIGURES" }
  | { type: "RESTART_GAME" }
  | { type: "GAME_OVER" };

export const initialState: GameState = {
  grid: createEmptyGrid(),
  availableFigures: generateRandomFigures(3),
  nextFigure: generateRandomFigures(1)[0],
  refreshCount: 0,
  score: 0,
  isGameOver: false,
  timerResetKey: 0,
};

function placeFigureOnGrid(
  grid: number[][],
  row: number,
  col: number,
  figure: number[][]
): number[][] {
  const newGrid = grid.map((row) => [...row]);

  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (figure[i][j] === 1) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < GRID_SIZE &&
          newCol >= 0 &&
          newCol < GRID_SIZE
        ) {
          newGrid[newRow][newCol] = 1;
        }
      }
    }
  }

  return newGrid;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE_FIGURE": {
      const { row, col, figure } = action.payload;

      const newGrid = placeFigureOnGrid(state.grid, row, col, figure);

      const newState = {
        ...state,
        grid: newGrid,
      };
      return newState;
    }

    case "UPDATE_GRID": {
      return {
        ...state,
        grid: action.payload,
      };
    }

    case "UPDATE_SCORE":
      return {
        ...state,
        score: action.payload,
      };

    case "UPDATE_FIGURES":
      return {
        ...state,
        availableFigures: action.payload,
      };

    case "UPDATE_NEXT_FIGURE":
      return {
        ...state,
        nextFigure: action.payload,
      };

    case "RESET_TIMER":
      return {
        ...state,
        timerResetKey: state.timerResetKey + 1,
      };

    case "REFRESH_FIGURES":
      if (state.refreshCount >= MAX_REFRESHES) {
        return state;
      }
      return {
        ...state,
        availableFigures: generateRandomFigures(3),
        nextFigure: generateRandomFigures(1)[0],
        refreshCount: state.refreshCount + 1,
      };

    case "RESTART_GAME":
      return {
        ...initialState,
        timerResetKey: state.timerResetKey + 1,
      };

    case "GAME_OVER":
      return {
        ...state,
        isGameOver: true,
      };

    default:
      return state;
  }
}
