import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  gameReducer,
  initialState,
  FigureData,
} from "../../src/Components/gameReducer";
import { GameAction, GameState } from "../../src/Components/gameReducer";
import { createEmptyGrid } from "../../src/Components/constants";

vi.mock("./constants", () => ({
  generateRandomFigures: vi.fn((count: number) => {
    const defaultFigure: FigureData = {
      shape: [[1], [1]],
      color: "red",
    };
    return Array(count).fill(defaultFigure);
  }),
}));

describe("game reducer", () => {
  let state: GameState;
  beforeEach(() => {
    state = {
      ...initialState,
      grid: createEmptyGrid(),
      availableFigures: [
        { shape: [[1], [1]], color: "blue" },
        { shape: [[1, 1]], color: "yellow" },
        { shape: [[1]], color: "green" },
      ],
      nextFigure: { shape: [[1, 1]], color: "orange" },
    };
  });

  it("placing figure on the grid", () => {
    const action: GameAction = {
      type: "PLACE_FIGURE",
      payload: {
        row: 0,
        col: 0,
        figure: [[1], [1]],
      },
    };
    const placeFigureState = gameReducer(state, action);
    expect(placeFigureState.grid[0][0]).toBe(1);
    expect(placeFigureState.grid[1][0]).toBe(1);
  });

  it("reseting timer", () => {
    const action: GameAction = {
      type: "RESET_TIMER",
    };
    state.timerResetKey = 5;
    const resetTimerState = gameReducer(state, action);
    expect(resetTimerState.timerResetKey).toBe(6);
  });

  it("refreshing figures", () => {
    const action: GameAction = {
      type: "REFRESH_FIGURES",
    };
    state.refreshCount = 2;
    const refreshCountState = gameReducer(state, action);
    expect(refreshCountState.refreshCount).toBe(3);
  });
});
