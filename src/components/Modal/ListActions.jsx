import React, { useRef, useEffect } from "react";
import { LiaTimesSolid } from "react-icons/lia";

const ListActions = ({ isOpen, onClose, position = "top-full left-full", onRename, onAddCard }) => {
  const dropdownRef = useRef(null);

  // Click outside để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${position} bg-white w-72 dark:bg-gray-700 border border-gray-200 p-3 rounded-md min-w-64 z-10 shadow-lg`}
    >
      {/* Nút đóng */}
      <div className="flex items-center justify-center relative mb-2">
        <h1>List Actions</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 absolute top-0 right-0"
        >
          <LiaTimesSolid size={18} />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <button
          className="w-full text-left hover:text-blue-500"
          onClick={() => {
            onRename?.();
            onClose();
          }}
        >
          Rename list
        </button>
        <button className="w-full text-left hover:text-blue-500" onClick={() => {
            onAddCard?.();
            onClose();
          }}>
          Add card
        </button>
        <button className="w-full text-left hover:text-blue-500">
          Copy list
        </button>
        <button className="w-full text-left hover:text-blue-500">
          Move all cards in this list
        </button>
        <button className="w-full text-left hover:text-blue-500">
          Archive this list
        </button>
      </div>
    </div>
  );
};

export default ListActions;
