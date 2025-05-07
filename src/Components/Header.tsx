import { useState, useEffect, useCallback } from "react";

type HeaderProps = {
  currentScore: number;
  onReturnToMenu: () => void;
};

export default function Header({ currentScore, onReturnToMenu }: HeaderProps) {
  const [record, setRecord] = useState(() => {
    const savedRecord = localStorage.getItem("gameRecord");
    return savedRecord ? Math.max(0, parseInt(savedRecord)) : 0;
  });

  const updateRecord = useCallback((newScore: number) => {
    setRecord((prevRecord) => {
      if (newScore > prevRecord) {
        localStorage.setItem("gameRecord", newScore.toString());
        return newScore;
      }
      return prevRecord;
    });
  }, []);

  useEffect(() => {
    if (currentScore > record) {
      const timer = setTimeout(() => {
        updateRecord(currentScore);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentScore, record, updateRecord]);

  return (
    <header>
      <span className="logo">1010!</span>
      <nav>
        <ul>
          <li className="record">Рекорд: {record}</li>
          <li>
            <button className="ret-but" onClick={onReturnToMenu}>Главное меню</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
