import { useEffect } from "react";
import { generateRandomFigures } from "./constants";
import Figure from "./Figure";

interface NextFigureProps {
  onNextFigureGenerated: (figureData: { shape: number[][]; color: string }) => void;
  nextFigure: { shape: number[][]; color: string } | null;
}

export default function NextFigure({ onNextFigureGenerated, nextFigure }: NextFigureProps) {
  useEffect(() => {
    const newFigure = generateRandomFigures(1)[0];
    onNextFigureGenerated(newFigure);
  }, []);

  return (
    <div className="next-figure">
        <h2>Следующая фигура:</h2>
      <div className="nextFigure">{nextFigure && <Figure figure={nextFigure.shape} color={nextFigure.color} index={-1} isPrev={true}/>}</div>
    </div>
  );
}
