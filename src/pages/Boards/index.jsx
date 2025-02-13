import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";

function Board() {
  const boardId = "eb12bad0-badb-4283-b924-d294ac640b4d";
  const dispatch = useDispatch();
  const { board, loading, error } = useSelector((state) => state.board);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardById(boardId));
    }

    return () => {
      dispatch(clearBoard()); // Cleanup khi rời khỏi trang
    };
  }, []);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      {board && (
        <>
          <BoardBar board={board.data} />
          <BoardContent board={board.data} />
        </>
      )}
    </>
  );
}

export default Board;
