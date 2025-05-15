import Game from "../../src/Components/Game";
import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

describe("game test", () => {
  it("renders score and new game button", () => {
    const onGameOver = vi.fn();
    const onScoreUpdate = vi.fn();

    render(
      <Game
        isTimedMode={false}
        onGameOver={onGameOver}
        onScoreUpdate={onScoreUpdate}
      />
    );

    expect(screen.getByText(/Счёт:/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Новая игра" })
    ).toBeInTheDocument();
  });

  it("calls onScoreUpdate on restart", () => {
    const onGameOver = vi.fn();
    const onScoreUpdate = vi.fn();

    render(
      <Game
        isTimedMode={false}
        onGameOver={onGameOver}
        onScoreUpdate={onScoreUpdate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Новая игра" }));
    expect(onScoreUpdate).toHaveBeenCalledWith(0);
  });
});
