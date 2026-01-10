import { GameBoard } from "./components/GameBoard";
import useFaviconTheme from "./hooks/useFaviconTheme";
import "./index.css";

function App() {

  useFaviconTheme();
  return (
    <div className="w-full h-screen">
      <GameBoard />
    </div>
  );
}

export default App;
