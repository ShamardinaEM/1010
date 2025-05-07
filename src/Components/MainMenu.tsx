interface MainMenuProps {
  onStart: (timedMode: boolean) => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="main-menu">
      <h1>1010!</h1>
      <table>
        <tr>
          <td>
            <button onClick={() => onStart(false)} className="start-button">
              Свободная игра
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button onClick={() => onStart(true)} className="time-game-button">
              Игра на время
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
}
