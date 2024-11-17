import { useEffect, useRef, useState } from "react";
import { BsBookmarkStarFill } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { FaGoogleDrive, FaRegStar, FaStar } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { IoCheckmarkOutline, IoPersonAddOutline } from "react-icons/io5";
import { MdFilterList, MdOutlinePublic } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { data } from "~/data/data";

function BoardBar({ board }) {
  const [isStarred, setIsStarred] = useState(data.board.starred);
  const [currentVisibility, setCurrentVisibility] = useState(data.board.type);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleVisibilityChange = (visibility) => {
    setCurrentVisibility(visibility);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibilityOptions = [
    {
      value: "private",
      label: "Private",
      icon: <CiLock size={20} />,
      description:
        "Only board members can see this board. Workspace admins can close the board or remove members.",
    },
    {
      value: "public",
      label: "Public",
      icon: <MdOutlinePublic size={20} />,
      description:
        "All members of the Sprint-1 Workspace can see and edit this board.",
    },
    {
      value: "workspace",
      label: "Workspace",
      icon: <PiUsersThreeLight size={20} />,
      description:
        "All members of the Sprint-1 Workspace can see and edit this board.",
    },
  ];

  return (
    <div className="text-primary dark:text-secondary bg-white bg-opacity-15 px-4 py-2 flex justify-between text-xs md:text-base flex-col lg:flex-row">
      <div className="flex items-center gap-4 justify-between lg:justify-start">
        <h1 className="font-semibold p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          {board?.title}
        </h1>
        <span
          onClick={handleToggleStar}
          id="star"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          {isStarred ? (
            <FaRegStar className="hover:text-yellow-500" size={20} />
          ) : (
            <FaStar size={20} color="#ffd600" />
          )}
        </span>
        <Tooltip
          anchorSelect="#star"
          clickable
          className="z-10"
          place="bottom-start"
        >
          Click to star or unstar this board. Starred boards show up at the top
          of your boards list.
        </Tooltip>
        <span
          onClick={toggleDropdown}
          ref={dropdownRef}
          id="visibility"
          className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 relative rounded-md border ${
            isDropdownOpen ? "border-primary" : "border-transparent"
          }`}
        >
          {
            visibilityOptions.find(
              (option) => option.value === currentVisibility
            ).icon
          }
          <span className="hidden lg:inline-block">
            {
              visibilityOptions.find(
                (option) => option.value === currentVisibility
              ).label
            }
          </span>
          {isDropdownOpen && (
            <ul className="absolute z-10 mt-2 top-full -right-20 lg:-left-1 min-w-72 lg:min-w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-secondary">
              {visibilityOptions.map((option) => (
                <li
                  onClick={() => handleVisibilityChange(option.value)}
                  key={option.value}
                  className="px-4 py-2 space-y-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-gray-700 rounded-md"
                >
                  <span className="flex items-center gap-1">
                    {option.icon}
                    <span className="text-xs lg:text-[14px]">
                      {option.label}
                    </span>
                    {option.value === currentVisibility ? (
                      <IoCheckmarkOutline size={20} />
                    ) : (
                      ""
                    )}
                  </span>
                  <p className="text-xs">{option.description}</p>
                </li>
              ))}
            </ul>
          )}
        </span>
        <Tooltip
          anchorSelect="#visibility"
          clickable
          className="z-10"
          place="bottom"
        >
          Change visibility
        </Tooltip>
        <span
          id="gg-drive"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
        >
          <FaGoogleDrive size={20} />{" "}
          <span className="hidden lg:inline-block">Add to Google Drive</span>
        </span>
        <Tooltip
          anchorSelect="#gg-drive"
          clickable
          className="z-10"
          place="bottom"
        >
          Add to Google Drive
        </Tooltip>
        <span
          id="automation"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
        >
          <IoIosFlash size={20} />{" "}
          <span className="hidden lg:inline-block">Automation</span>
        </span>
        <Tooltip
          anchorSelect="#automation"
          clickable
          className="z-10"
          place="bottom"
        >
          Automation
        </Tooltip>

        <span
          id="filter"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
        >
          <MdFilterList size={20} />
          <span className="hidden lg:inline-block">Filter</span>
        </span>
        <Tooltip anchorSelect="#filter" className="z-10" place="bottom">
          Filter <span className="px-2 py-1 bg-slate-600">F</span>
        </Tooltip>
      </div>
      <hr className="my-2 block lg:hidden" />
      <div className="flex justify-end">
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
          <span className="absolute bottom-0 right-0" id="admin">
            <BsBookmarkStarFill />
          </span>
          <Tooltip
            anchorSelect="#admin"
            clickable
            className="z-10"
            place="bottom"
          >
            This member is an admin of this board
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
          <span className="absolute bottom-0 right-0" id="admin">
            <BsBookmarkStarFill />
          </span>
          <Tooltip
            anchorSelect="#admin"
            clickable
            className="z-10"
            place="bottom"
          >
            This member is an admin of this board
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <span
            id="more"
            className="flex justify-center items-center w-6 h-6 lg:w-8 lg:h-8 rounded-full border bg-gray-700 text-xs"
          >
            +6
          </span>
          <Tooltip
            anchorSelect="#more"
            clickable
            className="z-10"
            place="bottom"
          >
            More
          </Tooltip>
        </div>
        <span
          id="invite"
          className="ml-6 py-1 px-2 lg:py-2 lg:px-3 rounded-md bg-primary dark:bg-gray-700 cursor-pointer text-white flex items-center gap-1"
        >
          <IoPersonAddOutline size={15} /> Invite
        </span>
        <Tooltip
          anchorSelect="#invite"
          clickable
          className="z-10"
          place="bottom"
        >
          Invite
        </Tooltip>
      </div>
    </div>
  );
}

export default BoardBar;
