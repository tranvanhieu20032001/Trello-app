import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { data } from "./../../data/data";
import { useEffect, useState } from "react";
import { fetchBoardById_API } from "~/apis";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "0a81bc5f-42e6-4b2d-8729-78747328d8f7";
    fetchBoardById_API(boardId).then((board) => {
      setBoard(board.data);
      console.log("Board", board);
    });
  }, []);
  return (
    <>
      <Navbar />
      {board && (
        <>
          <BoardBar board={board} />
          <BoardContent board={board} />
        </>
      )}
    </>
  );
}

export default Board;
