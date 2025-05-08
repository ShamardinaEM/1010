import { generateRandomFigures, GRID_SIZE, createEmptyGrid } from "./constants";
import { useState, useEffect, useCallback } from "react";
import { useImmer } from "use-immer";
import Timer from "./Timerr";
import NextFigure from "./NextFigure";
import RefreshingButton from "./RefreshingButton";
import Figure from "./Figure";
import Grid from "./Grid";

interface GameProps {
  onGameOver: () => void;
  onScoreUpdate: (score: number) => void;
  currentScore: number;
  isTimedMode: boolean;
}

export default function Game({
  onGameOver,
  onScoreUpdate,
  currentScore,
  isTimedMode,
}: GameProps) {
  const [grid, updateGrid] = useImmer<number[][]>(createEmptyGrid()); //используем immer для изменения grid
  const [availableFigures, setAvailableFigures] = useState(
    generateRandomFigures()
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextFigure, setNextFigure] = useState<{
    shape: number[][];
    color: string;
  } | null>(null);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);

  const canPlaceFigure = useCallback((
    row: number,
    col: number,
    figure: number[][]
  ): boolean => {
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
  }, [grid]);

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

  useEffect(() => {
    if (!canPlaceAnyFigure()) {
      setIsGameOver(true);
      onGameOver();
    }
  }, [grid, availableFigures, canPlaceAnyFigure, onGameOver]);

  const checkAndClearLines = useCallback((): number => {
    let cleared = 0;

    updateGrid((draft: number[][]) => {
      for (let row = 0; row < GRID_SIZE; row++) {
        if (draft[row].every((cell: number) => cell === 1)) {
          cleared++;
          draft[row] = Array(GRID_SIZE).fill(0);
        }
      }

      for (let col = 0; col < GRID_SIZE; col++) {
        let isColumnFull = true;
        for (let row = 0; row < GRID_SIZE; row++) {
          if (draft[row][col] !== 1) {
            isColumnFull = false;
            break;
          }
        }
        if (isColumnFull) {
          cleared++;
          for (let row = 0; row < GRID_SIZE; row++) {
            draft[row][col] = 0;
          }
        }
      }
    });

    const bonusScore = cleared * 10;
    return bonusScore;
  }, [updateGrid]);

  const placeFigure = useCallback((
    row: number,
    col: number,
    figureIndex: number,
    figure: number[][]
  ) => {
    if (!canPlaceFigure(row, col, figure)) return false;

    let cellsPlaced = 0;

    updateGrid((draft: number[][]) => {
      for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
          if (figure[i][j] === 1) {
            draft[row + i][col + j] = 1;
            cellsPlaced++;
          }
        }
      }
    });

    const newScoreAfterPlacement = currentScore + cellsPlaced;
    onScoreUpdate(newScoreAfterPlacement);

    const bonusScore = checkAndClearLines();
    const finalScore = newScoreAfterPlacement + bonusScore;
    onScoreUpdate(finalScore);

    const updatedFigures = [...availableFigures];

    if (nextFigure) {
      updatedFigures[figureIndex] = nextFigure;
      setAvailableFigures(updatedFigures);
      setNextFigure(generateRandomFigures(1)[0]);
    }

    if (isTimedMode) {
      setTimerResetKey((prevKey) => prevKey + 1);
    }

    return true;
  }, [
    canPlaceFigure,
    availableFigures,
    updateGrid,
  ]);

  const restartGame = () => {
    updateGrid(() => createEmptyGrid());
    setAvailableFigures(generateRandomFigures());
    onScoreUpdate(0);
    setIsGameOver(false);
    setTimerResetKey((prev) => prev + 1);
    setRefreshCount(0);
  };

  const refreshAllFigures = () => {
    if (refreshCount >= 3) return;

    setAvailableFigures(generateRandomFigures());
    setNextFigure(generateRandomFigures(1)[0]);
    setRefreshCount((prev) => prev + 1);
  };

  const handleOutOfTime = () => {
    setIsGameOver(true);
    onGameOver();
  };

  return (
    <div className="game-container">
      <table>
        <tr>
          <td>
            <Timer
              isGameOver={isGameOver}
              resetKey={timerResetKey}
              isTimedMode={isTimedMode}
              outOfTime={handleOutOfTime}
            />
            <h2>Счет: {currentScore}</h2>
          </td>
          <td className="restart-butt" rowSpan={2}>
            <button className="game-button" onClick={restartGame}>
              Новая игра
            </button>
          </td>
        </tr>
      </table>
      <div className="spec">
        <Grid
          grid={grid}
          onDropFigure={placeFigure}
          figures={availableFigures}
        />
        <table>
          <tr>
            <td>
              <NextFigure
                nextFigure={nextFigure}
                onNextFigureGenerated={setNextFigure}
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
