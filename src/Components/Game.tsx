import { useEffect, useCallback, useReducer } from "react";
import { generateRandomFigures, GRID_SIZE } from "./constants";
import { gameReducer, initialState } from "./gameReducer";
import Timer from "./Timerr";
import NextFigure from "./NextFigure";
import RefreshingButton from "./RefreshingButton";
import Figure from "./Figure";
import Grid from "./Grid";

interface GameProps {
  onGameOver: () => void;
  onScoreUpdate: (score: number) => void;
  isTimedMode: boolean;
}

export default function Game({
  onGameOver,
  onScoreUpdate,
  isTimedMode,
}: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { grid, availableFigures, isGameOver, nextFigure, timerResetKey, refreshCount, score } = state;

  const canPlaceFigure = useCallback(
    (row: number, col: number, figure: number[][]): boolean => {
      for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
          if (figure[i][j] === 1) {
            if (
              row + i >= GRID_SIZE ||
              col + j >= GRID_SIZE ||
              grid[row + i][col + j] === 1
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [grid]
  );

  const canPlaceAnyFigure = useCallback((): boolean => {
    return availableFigures.some((figure) => {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (canPlaceFigure(row, col, figure.shape)) {
            return true;
          }
        }
      }
      return false;
    });
  }, [availableFigures, canPlaceFigure]);

  const placeFigure = (
    row: number,
    col: number,
    figureIndex: number,
    figure: number[][]
  ): boolean => {
    if (!canPlaceFigure(row, col, figure)) return false;

    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[i].length; j++) {
        if (figure[i][j] === 1) {
          newGrid[row + i][col + j] = 1;
        }
      }
    }
  
    let cleared = 0;
  
    for (let r = 0; r < GRID_SIZE; r++) {
      if (newGrid[r].every(cell => cell === 1)) {
        newGrid[r] = Array(GRID_SIZE).fill(0);
        cleared++;
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      const isFullCol = newGrid.every(row => row[c] === 1);
      if (isFullCol) {
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r][c] = 0;
        }
        cleared++;
      }
    }

    let newScore = score + figure.flat().filter(cell => cell === 1).length;
    newScore += cleared * 10;

    dispatch({ type: "UPDATE_GRID", payload: newGrid });
    dispatch({ type: "UPDATE_SCORE", payload: newScore });
    onScoreUpdate(newScore);
  
    const updatedFigures = [...availableFigures];
    updatedFigures[figureIndex] = nextFigure;
    dispatch({ type: "UPDATE_FIGURES", payload: updatedFigures });
    dispatch({ type: "UPDATE_NEXT_FIGURE", payload: generateRandomFigures(1)[0] });
  
    if (isTimedMode) {
      dispatch({ type: "RESET_TIMER" });
    }
  
    return true;
  };
  

  const restartGame = () => {
    dispatch({ type: "RESTART_GAME" });
    onScoreUpdate(0);
  };

  const refreshAllFigures = () => {
    if (refreshCount >= 3) return;
    dispatch({ type: "REFRESH_FIGURES" });
  };

  const handleOutOfTime = () => {
    dispatch({ type: "GAME_OVER" });
    onGameOver();
  };

  useEffect(() => {
    if (!canPlaceAnyFigure()) {
      dispatch({ type: "GAME_OVER" });
      onGameOver();
    }
  }, [canPlaceAnyFigure, grid, availableFigures, onGameOver]);

  return (
    <div className="game-container">
      <table>
        <tbody>
          <tr>
            <td>
              <Timer
                isGameOver={isGameOver}
                resetKey={timerResetKey}
                isTimedMode={isTimedMode}
                outOfTime={handleOutOfTime}
              />
              <h2>Счёт: {score}</h2>
            </td>
            <td rowSpan={2} className="restart-butt">
              <button className="game-button" onClick={restartGame}>
                Новая игра
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="spec">
        <Grid
          grid={grid}
          onDropFigure={placeFigure}
          figures={availableFigures}
        />
        <table>
          <tbody>
            <tr>
              <td>
                <NextFigure
                  nextFigure={nextFigure}
                  onNextFigureGenerated={(figure) =>
                    dispatch({ type: "UPDATE_NEXT_FIGURE", payload: figure })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <RefreshingButton
                  onClick={refreshAllFigures}
                  disabled={isGameOver}
                />
              </td>
            </tr>
            <tr>
              <td>
                <p>Осталось обновлений: {3 - refreshCount}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="figures-grid">
        {availableFigures.map((figureData, index) => (
          <div key={index} className="figure-cell">
            <Figure
              figure={figureData.shape}
              color={figureData.color}
              index={index}
              isPrev={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
