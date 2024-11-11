import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

function Recent() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-600 lg:hover:bg-gray-200 ${
          isOpen ? "bg-gray-600 lg:bg-gray-200" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Recent <MdOutlineArrowDropDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute -top-4 lg:top-full right-full lg:left-0 mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-60 lg:min-w-80 z-10 text-primary dark:text-secondary">
          <ul>
            <li className="py-2 px-4 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Chú bé đần
            </li>
            <li className="py-2 px-4 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Sprint-1
            </li>
            <li className="py-2 px-4 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Trello workspace
            </li>
            <li className="py-2 px-4 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Chatbox-V1
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Recent;
