import { memo } from "react";

interface GridProps {
  grid: number[][];
  onDropFigure: (row: number, col: number, figureIndex: number, figure: number[][]) => void;
  figures: { shape: number[][]; color: string }[];
}

const Grid = memo(function Grid({ grid, onDropFigure, figures }: GridProps) {
  const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
    const figureIndex = parseInt(e.dataTransfer.getData("figure-index"));
    const offsetRow = parseInt(e.dataTransfer.getData("offset-row"));
    const offsetCol = parseInt(e.dataTransfer.getData("offset-col"));

    const { shape } = figures[figureIndex];
    onDropFigure(targetRow - offsetRow, targetCol - offsetCol, figureIndex, shape);
  };

  const preventDefault = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell === 1 ? "filled" : "empty"}`}
            onDragOver={preventDefault}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
});

export default Grid;