import Timer from "../../src/Components/Timerr";
import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

describe("timer check", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("display timer in free mode", () => {
    render(
      <Timer
        isGameOver={false}
        isTimedMode={false}
        resetKey={0}
        outOfTime={() => {}}
      />
    );

    expect(screen.getByText("Прошло времени: 00:00")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("Прошло времени: 00:03")).toBeInTheDocument();
  });

  it("display time in timed mode", () => {
    const outOfTimeMock = vi.fn();

    render(
      <Timer
        isGameOver={false}
        isTimedMode={true}
        resetKey={0}
        outOfTime={outOfTimeMock}
      />
    );

    expect(screen.getByText("Оставшееся время: 00:10")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(screen.getByText("Оставшееся время: 00:01")).toBeInTheDocument();
    expect(outOfTimeMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Оставшееся время: 00:00")).toBeInTheDocument();
    expect(outOfTimeMock).toHaveBeenCalledOnce();
  });

  it("doesn't update time if game is over", () => {
    render(
      <Timer
        isGameOver={true}
        isTimedMode={false}
        resetKey={0}
        outOfTime={() => {}}
      />
    );

    expect(screen.getByText("Прошло времени: 00:00")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("Прошло времени: 00:00")).toBeInTheDocument();
  });
});
