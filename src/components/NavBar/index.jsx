import { useEffect, useRef, useState } from "react";
import ModeSelect from "../Mode";
import { BiSolidGrid } from "react-icons/bi";
import { FaTrello } from "react-icons/fa6";
import Workspace from "./Menus/Workspace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BsBell } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import Profile from "./Menus/Profile";
import Search from "./Menus/Search";
import { MdOutlineArrowDropDown } from "react-icons/md";

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showDropDown = () => {
    setOpen((prev) => !prev);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      showDropDown();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="navbar" className="relative flex flex-col lg:flex-row justify-between gap-2 px-4 py-2 bg-light dark:bg-dark text-primary dark:text-secondary text-xs md:text-sm shadow-md">
      <div className="flex items-center gap-1 justify-between">
        <div className="p-2 hover:bg-gray-700 rounded-full">
          <BiSolidGrid className="text-primary dark:text-secondary" size={20} />
        </div>
        <span className="inline-flex items-center gap-1">
          <FaTrello size={20} /> Trello
        </span>
        <Workspace />
        <div className="hidden lg:flex items-center gap-1">
          <Recent />
          <Starred />
          <Templates />
        </div>
        <div className="block lg:hidden relative" ref={dropdownRef}>
          <button
            onClick={showDropDown}
            onKeyDown={handleKeyDown}
            aria-haspopup="true"
            aria-expanded={open}
            className="flex items-center gap-1 py-1 px-2 lg:px-3 lg:py-2 rounded-md bg-primary dark:bg-secondary text-white"
          >
            More <MdOutlineArrowDropDown size={15} />
          </button>
          {open && (
            <div className="absolute top-full mt-2 bg-gray-700 border border-gray-200 p-2 rounded-md min-w-10 z-10 text-gray-200">
              <Recent />
              <Starred />
              <Templates />
            </div>
          )}
        </div>
        <button className="flex items-center gap-2 py-1 px-2 lg:px-3 lg:py-2 rounded-md bg-primary dark:bg-gray-700 text-white">
          Create
        </button>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <Search />
        <ModeSelect />
        <div
          id="notify"
          className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <BsBell size={20} />
          <span className="absolute w-2 h-2 rounded-full bg-red-600 top-2 right-2"></span>
        </div>
        <Tooltip anchorSelect="#notify" clickable className="z-10">
          Notifications
        </Tooltip>
        <div
          id="information"
          className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <IoIosInformationCircleOutline size={20} />
        </div>
        <Tooltip anchorSelect="#information" clickable className="z-10">
          Information
        </Tooltip>
        <Profile />
      </div>
    </div>
  );
}

export default Navbar;
