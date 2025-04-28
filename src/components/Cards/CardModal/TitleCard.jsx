import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { dateComplete_API, moveCard_API } from "~/apis";

const TitleCard = ({ card, boards }) => {
  const dropdownRef = useRef(null);
  const [isComplete, setIsComplete] = useState(null);
  const [columnTitle, setColumnTitle] = useState(
    boards?.columns.find((c) => c.id === card.columnId).title
  );
  const [isOpen, setIsOpen] = useState(false);
  const [columnId, setColumnId] = useState(null);
  const [action, setAction] = useState(false);

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
    setColumnTitle(boards?.columns.find((c) => c.id === card.columnId).title);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsComplete(card?.isComplete);
  }, [card?.isComplete]);

  const handleDateComplete = async () => {
    const newStatus = !isComplete;
    setIsComplete(newStatus);
    await dateComplete_API(card?.id, newStatus);
  };

  return (
    <div className="text-sm py-2 flex items-center gap-2">
      <input
        data-tooltip-id={`complete-${card?.id}`}
        type="checkbox"
        checked={isComplete}
        className="w-5 h-5"
        onChange={handleDateComplete}
      />
      <span className="font-medium text-base">{card?.title}</span> in list{" "}
      <div className="relative w-44 text-sm" ref={dropdownRef}>
        <button
          className="p-1 px-2 w-full flex justify-between items-center border border-gray-300 rounded-md bg-white"
          onClick={() => setIsOpen(true)}
        >
          {columnTitle}
          <IoIosArrowDown size={14} />
        </button>
        {isOpen && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {boards?.columns.map((column, index) => (
              <li
                key={index}
                onClick={() => handleChangeList(column)}
                className="p-1 px-2 cursor-pointer hover:bg-gray-200"
              >
                {column.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      {action ? (
        <div className=" space-x-2">
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
      ) : (
        ""
      )}
    </div>
  );
};

export default TitleCard;
