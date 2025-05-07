import { useRef, useState } from "react";

interface FigureProps {
  figure: number[][];
  color: string;
  index: number;
  isPrev: boolean;
}

export default function Figure({ figure, color, index, isPrev = false}: FigureProps) {
  const dragOffset = useRef({ row: 0, col: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (i: number, j: number) => {
    dragOffset.current = { row: i, col: j };
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("figure-index", index.toString());
    e.dataTransfer.setData("offset-row", dragOffset.current.row.toString());
    e.dataTransfer.setData("offset-col", dragOffset.current.col.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`figure ${isDragging ? 'dragging' : ''}`}
      draggable={!isPrev}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {figure.map((row, i) => (
        <div key={i} className="figure-row">
          {row.map((cell, j) => cell === 1 ? (
            <div
              key={j}
              className="cell"
              onMouseDown={() => handleMouseDown(i, j)}
              style={{ 
                backgroundColor: color,
                cursor: 'grab'
              }}
            />
          ) : (
            <div key={j} className="cell" />
          ))}
        </div>
      ))}
    </div>
  );
}