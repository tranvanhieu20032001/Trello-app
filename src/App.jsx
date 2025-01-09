import "./App.css";
import Board from "./pages/Boards/_id";

function App() {
  return (
    <div className="bg-[url('assets/bg.jpg')] bg-cover h-screen max-h-screen block overflow-y-hidden">
      <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
        <Board />
      </div>
    </div>
  );
}

export default App;
