import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { dateComplete_API, moveCard_API, uploadCardTitle_API } from "~/apis";

const TitleCard = ({ card, boards }) => {
  const dropdownRef = useRef(null);
  const titleRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);
  const [columnTitle, setColumnTitle] = useState(
    boards?.columns.find((c) => c.id === card.columnId)?.title || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const [columnId, setColumnId] = useState(null);
  const [action, setAction] = useState(false);

  // --- For editing title ---
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);

  const handleChangeList = (column) => {
    setColumnTitle(column?.title);
    setColumnId(column?.id);
    setIsOpen(false);
    setAction(column?.id !== card.columnId);
  };

  const handleMove = async () => {
    if (!columnId || columnId === card.columnId) return;
    try {
      await moveCard_API({ cardId: card.id, columnId });
      setAction(false);
    } catch (error) {
      console.error("Failed to move card:", error);
    }
  };

  const handleCancel = () => {
    setAction(false);
    setColumnTitle(
      boards?.columns.find((c) => c.id === card.columnId)?.title || ""
    );
  };

  const handleDateComplete = async () => {
    const newStatus = !isComplete;
    setIsComplete(newStatus);
    await dateComplete_API(card?.id, newStatus);
  };

  const handleChange = (e) => setNewTitle(e.target.value);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && newTitle.trim() !== "") {
      await uploadCardTitle_API(card.id, newTitle);
      setNewTitle(newTitle)
      setEdit(false);
    } else if (e.key === "Escape") {
      setEdit(false);
      setNewTitle(card.title); // reset nếu huỷ
    }
  };

  useEffect(() => {
    setIsComplete(card?.isComplete);
  }, [card?.isComplete]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (titleRef.current && !titleRef.current.contains(event.target)) {
        setEdit(false);
        setNewTitle(card.title); // reset nếu chưa lưu
      }
    };

    if (edit) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [edit, card.title]);

  return (
    <div className="text-sm py-2 flex items-center gap-2 flex-wrap">
      <input
        data-tooltip-id={`complete-${card?.id}`}
        type="checkbox"
        checked={isComplete}
        className="w-5 h-5"
        onChange={handleDateComplete}
      />

      {!edit ? (
        <h1
          className="font-medium text-base cursor-pointer"
          onClick={() => setEdit(true)}
        >
          {newTitle}
        </h1>
      ) : (
        <input
          ref={titleRef}
          className="border outline-none px-2 py-1 text-sm rounded-md font-medium text-primary"
          value={newTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      <span className="text-sm">in list</span>

      <div className="relative w-44 text-sm" ref={dropdownRef}>
        <button
          className="p-1 px-2 w-full flex justify-between items-center border border-gray-300 rounded-md bg-white"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {columnTitle}
          <IoIosArrowDown size={14} />
        </button>
        {isOpen && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {boards?.columns.map((column) => (
              <li
                key={column.id}
                onClick={() => handleChangeList(column)}
                className="p-1 px-2 cursor-pointer hover:bg-gray-200"
              >
                {column.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {action && (
        <div className="space-x-2">
          <button
            className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm"
            onClick={handleMove}
          >
            Move
          </button>
          <button
            className="text-sm bg-gray-300 text-primary hover:bg-gray-500 border px-2 py-1 rounded-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleCard;
