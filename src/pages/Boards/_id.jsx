import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { data } from "./../../data/data";

function Board() {
  return (
    <>
      <Navbar />
      <BoardBar board={data?.board} />
      <BoardContent board={data?.board} />
    </>
  );
}

export default Board;
