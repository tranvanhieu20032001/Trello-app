import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";

function Board() {
  const boardId = "15fe082e-1bb0-430b-ad14-8ca93d520a63";
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
    <div className="bg-[url('assets/bg.jpg')] bg-cover h-screen max-h-screen block overflow-y-hidden">
      <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
        <Navbar />
        {board && (
          <>
            <BoardBar board={board.data} />
            <BoardContent board={board.data} />
          </>
        )}
      </div>
    </div>
  );
}

export default Board;
