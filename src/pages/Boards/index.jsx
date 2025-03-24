import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";

function Board() {
  const boardId = "daf9f03b-5bcc-4b68-8c27-46650555449e";
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
        {/* <Navbar /> */}
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
