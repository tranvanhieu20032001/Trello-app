import { ToastContainer } from "react-toastify";
import "./App.css";
import Board from "./pages/Boards";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Login/>
      {/* <div className="bg-[url('assets/bg.jpg')] bg-cover h-screen max-h-screen block overflow-y-hidden">
        <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
          <Board />
        </div>
      </div> */}
    </>
  );
}

export default App;
