import { useEffect, useRef, useState } from "react";
import ModeSelect from "../Mode";
import { BiSolidGrid } from "react-icons/bi";
import { FaTrello } from "react-icons/fa6";
import Workspace from "./Menus/Workspace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Profile from "./Menus/Profile";
import Search from "./Menus/Search";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";
import Create from "./Menus/Create";
import Notifications from "./Menus/Notifications";
import { useSelector } from "react-redux";
import Informations from "./Menus/Informations";

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

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
  }, [user?.id]);

  return (
    <div
      id="navbar"
      className="relative flex flex-col lg:flex-row justify-between gap-2 px-4 py-2 bg-light dark:bg-dark text-primary dark:text-secondary text-xs md:text-sm shadow-md"
    >
      <div className="flex items-center gap-1 justify-between">
        <div className="p-2 hover:bg-gray-700 rounded-full">
          <BiSolidGrid className="text-primary dark:text-secondary" size={20} />
        </div>
        <Link to="/" className="inline-flex items-center gap-1">
          <FaTrello size={20} /> Trello
        </Link>
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
        <Create />
      </div>
      <div className="flex items-center gap-2 justify-between">
        <Search />
        <ModeSelect />
        <Notifications />
        <Informations />
        <Profile />
      </div>
    </div>
  );
}

export default Navbar;
