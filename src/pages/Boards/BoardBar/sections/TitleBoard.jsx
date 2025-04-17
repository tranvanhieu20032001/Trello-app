import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { renameBoard_API } from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";

const TitleBoard = ({ data }) => {
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(data?.title);
  const user = useSelector((state) => state.auth.user);
  const inputRef = useRef(null);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setEdit(false);
        setNewTitle(data?.title);
      }
    };

    if (edit) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [edit, newTitle, data?.title]);

  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const trimmedTitle = newTitle.trim();

      if (!trimmedTitle) {
        setNewTitle(data?.title);
        setEdit(false);
        return;
      }

      if (trimmedTitle !== data?.title) {
        try {
          await renameBoard_API(boardId, trimmedTitle);
          dispatch(fetchBoardById(boardId));
        } catch (error) {
          toast.error(error.response.data.message);
          setNewTitle(data?.title);
        }
      }

      setEdit(false);
    } else if (e.key === "Escape") {
      setNewTitle(data?.title);
      setEdit(false);
    }
  };

  return (
    <div ref={inputRef}>
      {!edit ? (
        <h1
          className="titleboard font-semibold p-2 hover:bg-gray-600 rounded-md"
          onClick={user?.id === data?.ownerId ? () => setEdit(true) : undefined}
        >
          {newTitle}
        </h1>
      ) : (
        <input
          className="border outline-none px-2 py-1 text-sm rounded-md text-primary"
          value={newTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}
    </div>
  );
};

export default TitleBoard;
