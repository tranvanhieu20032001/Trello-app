import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

function Workspace() {
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
        className={`flex items-center gap-1 px-2 py-2 rounded-md  lg:hover:bg-gray-200 ${
          isOpen ? "bg-gray-200" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Workspace <MdOutlineArrowDropDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-60 lg:min-w-80 z-10 text-primary dark:text-secondary">
          <h4 className="text-[12px] px-4 py-2 font-medium">
            Current Workspace
          </h4>
          <ul>
            <li className="py-2 px-4 rounded-md flex items-center gap-4">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Trello workspace
            </li>
          </ul>
          <hr className="border-gray-200 my-2" />
          <h4 className="text-[12px] px-4 py-2 font-medium">Your Workspaces</h4>
          <ul>
            <li className="py-2 px-4 hover:bg-gray-600 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Chú bé đần
            </li>
            <li className="py-2 px-4 hover:bg-gray-600 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Sprint-1
            </li>
            <li className="py-2 px-4 hover:bg-gray-600 rounded-md flex items-center gap-4 cursor-pointer">
              <span className="w-10 h-10 rounded-sm flex justify-center items-center bg-blue-300">
                Hieu
              </span>
              Trello workspace
            </li>
            <li className="py-2 px-4 hover:bg-gray-600 rounded-md flex items-center gap-4 cursor-pointer">
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

export default Workspace;
