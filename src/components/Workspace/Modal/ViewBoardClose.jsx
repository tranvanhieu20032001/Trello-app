import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiRedo } from "react-icons/ci";
import { FaFlipboard } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

const ViewBoardClose = ({ dataBoard }) => {
  console.log("dataBoard", dataBoard);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
        <button
          className="absolute flex items-center justify-center p-2 rounded-full hover:shadow-lg hover:bg-gray-200 top-3 right-3 text-gray-600 hover:text-gray-800"
          //   onClick={onClose}
        >
            <LiaTimesSolid size={18} />
        </button>
        <div className="flex items-center gap-2 text-xl font-medium">
          <FaFlipboard /> Closed boards
        </div>
        <div className="mt-3">
          {dataBoard?.map((board, index) => (
            <Link
              to={`/board/${board.id}`}
              key={board.id}
              className="flex gap-2 items-center w-full group p-1.5 hover:bg-gray-200 relative"
            >
              <img
                src={board?.background}
                alt=""
                className="w-9 h-6 object-cover object-center rounded-sm"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm capitalize">{board.title}</span>

                <div className="items-center gap-2 flex">
                  <button className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm flex items-center gap-1">
                    <CiRedo size={18} /> reopen
                  </button>
                  <button className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm flex items-center gap-1">
                    <AiOutlineDelete size={18} /> Remove
                  </button>
                  <button className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm flex items-center gap-1">
                    <LiaTimesSolid size={18} /> Leave
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewBoardClose;
