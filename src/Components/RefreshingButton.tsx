interface RefreshFiguresButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function RefreshingButton  ({ onClick, disabled }: RefreshFiguresButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="refresh-button"
    >
      Обновить фигуры
    </button>
  );
};

