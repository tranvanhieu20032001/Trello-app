import "./App.css";
import ModeSelect from "./components/Mode";
import Board from "./pages/Boards/_id";

function App() {
  return (
    <div className="bg-white dark:bg-gray-800">
      <Board />
    </div>
  );
}

export default App;
