import Header from "./Components/Header";
import MainMenu from "./Components/MainMenu";
import Game from "./Components/Game";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isTimedMode, setIsTimedMode] = useState(false);

  const handleStart = (timedMode: boolean) => {
    setIsTimedMode(timedMode);
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
  };

  const restartGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="main-content">
      <Header currentScore={score} onReturnToMenu={() => setIsPlaying(false)} />
      {isPlaying ? (
        isGameOver ? (
          <div className="game-over-screen">
            <h1>Игра окончена!</h1>
            <h2>Счет: {score}</h2>
            <table>
              <tr>
                <td>
                  <button onClick={restartGame}>Новая игра</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={() => setIsPlaying(false)}>
                    Главное меню
                  </button>
                </td>
              </tr>
            </table>
          </div>
        ) : (
          <Game
            onGameOver={() => setIsGameOver(true)}
            onScoreUpdate={(newScore) => setScore(newScore)}
            currentScore={score}
            isTimedMode={isTimedMode}
          />
        )
      ) : (
        <MainMenu onStart={handleStart} />
      )}
    </div>
  );
}
