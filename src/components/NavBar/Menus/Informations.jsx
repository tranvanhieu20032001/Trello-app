import React, { useEffect, useRef, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import informations from "~/assets/informations.png";

const Informations = () => {
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
    <div className="relative" ref={dropdownRef}>
      <div
        id="information"
        className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosInformationCircleOutline size={20} />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md min-w-72 lg:min-w-80 z-10 shadow-xl overflow-hidden flex flex-col justify-center items-center p-2">
          <img
            src={informations}
            alt="Information"
            className="max-w-full max-h-48 object-contain"
          />
          <p className="text-center p-2">Get inspired by dozens of different Trello workflows</p>
        </div>
      )}

      <Tooltip anchorSelect="#information" clickable className="z-10">
        Information
      </Tooltip>
    </div>
  );
};

export default Informations;
