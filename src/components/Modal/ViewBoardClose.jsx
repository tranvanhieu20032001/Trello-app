import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiRedo } from "react-icons/ci";
import { FaFlipboard } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import ConfirmAction from "./ConfirmAction";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import { useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";

const ViewBoardClose = ({ dataBoard, onClose }) => {
  console.log("dataBoard", dataBoard);
  const user = useSelector((state) => state.auth.user);
  console.log("user", user);

  const [activeIndex, setActiveIndex] = useState(null);
  const { handleReOpenBoard } = useBoardActions();
  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative"
        ref={modalRef}
      >
        <button
          className="absolute flex items-center justify-center p-2 rounded-full hover:shadow-lg hover:bg-gray-200 top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
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
              className="flex gap-2 items-center w-full group p-1.5 hover:bg-gray-100 relative"
            >
              <img
                src={board?.background}
                alt=""
                className="w-9 h-6 object-cover object-center rounded-sm"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm capitalize">{board.title}</span>

                <div className="items-center gap-2 flex relative">
                  <button
                    data-tooltip-id="reopen"
                    className="text-sm text-primary hover:shadow-sm hover:bg-white p-1 rounded-full flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveIndex(index);
                    }}
                  >
                    <CiRedo size={18} />
                  </button>
                  <Tooltip id="reopen" place="bottom" clickable>
                    Reopen workspace
                  </Tooltip>
                  <button
                    data-tooltip-id="leave"
                    className="text-sm text-red-500 hover:shadow-sm hover:bg-white p-1 rounded-full flex items-center gap-1"
                  >
                    <IoIosLogOut size={18} />
                    <Tooltip id="leave" place="bottom" clickable>
                      Leave board
                    </Tooltip>
                  </button>
                  {board.ownerId === user.id && (
                    <button
                      data-tooltip-id="remove"
                      className="text-sm text-red-500 hover:shadow-sm hover:bg-white p-1 rounded-full flex items-center gap-1"
                    >
                      <AiOutlineDelete size={18} />
                      <Tooltip id="remove" place="bottom" clickable>
                        Remove board
                      </Tooltip>
                    </button>
                  )}

                  <ConfirmAction
                    isOpen={activeIndex === index}
                    onClose={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveIndex(null);
                    }}
                    onConfirm={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReOpenBoard(board.id, board.workspaceId);
                      setActiveIndex(null);
                    }}
                    title="Reopen Board"
                    message={`Are you sure you want to open ${board?.title}?`}
                    position="right-0 top-full"
                  />
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
