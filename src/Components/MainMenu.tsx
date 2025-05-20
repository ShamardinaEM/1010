interface MainMenuProps {
  onStart: (timedMode: boolean) => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="main-menu">
      <table>
        <tbody>
          <tr>
            <td>
              <button onClick={() => onStart(false)} className="game-button">
                Свободная игра
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => onStart(true)} className="game-button">
                Игра на время
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
