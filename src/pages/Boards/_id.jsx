import React from "react";
import Navbar from "../../components/NavBar";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";

function Board() {
  return (
    <>
      <Navbar />
      <BoardBar />
      <BoardContent />
    </>
  );
}

export default Board;
