import { useRef, useState, useEffect } from "react";
import { CiLock } from "react-icons/ci";
import { IoCheckmarkOutline } from "react-icons/io5";
import { MdOutlinePublic } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { visibilityChange_API } from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";

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
    description: "Public boards are visible to anyone on the internet.",
  },
];

const Visibility = () => {
  const dropdownRef = useRef(null);
  const { board } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  const [currentVisibility, setCurrentVisibility] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (board?.data?.type) {
      setCurrentVisibility(board?.data?.type);
    }
  }, [board?.data?.type]);

  const selectedOption = visibilityOptions.find(
    (option) => option.value === currentVisibility
  );

  const handleVisibilityChange = async (visibility) => {
    try {
      await visibilityChange_API(board?.data?.id, visibility);

      setCurrentVisibility(visibility);
      dispatch(fetchBoardById(board?.data?.id));

      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to change visibility:", error);
      alert("An error occurred while changing the visibility.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        id="visibility"
        className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 rounded-md border ${
          isDropdownOpen ? "border-primary" : "border-transparent"
        }`}
      >
        {selectedOption ? selectedOption.icon : <CiLock size={20} />}
      </button>

      {isDropdownOpen && (
        <ul
          className={`absolute z-10 mt-2 top-full left-0 min-w-72 lg:min-w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-secondary ${
            user.id !== board?.data?.ownerId
              ? "pointer-events-none opacity-60"
              : ""
          }`}
        >
          {visibilityOptions.map((option) => (
            <li
              onClick={() => handleVisibilityChange(option.value)}
              key={option.value}
              className="px-4 py-2 space-y-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <span className="flex items-center gap-1">
                {option.icon}
                <span className="text-xs lg:text-[14px]">{option.label}</span>
                {option.value === currentVisibility && (
                  <IoCheckmarkOutline size={20} />
                )}
              </span>
              <p className="text-xs">{option.description}</p>
            </li>
          ))}
        </ul>
      )}

      <Tooltip
        anchorSelect="#visibility"
        clickable
        className="z-10"
        place="bottom"
      >
        Change visibility
      </Tooltip>
    </div>
  );
};

export default Visibility;
