import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useBoardActions } from "~/utils/hooks/useBoardActions";

function Starred() {
  const [isOpen, setIsOpen] = useState(false);
  const { handlGetBoardByStarred } = useBoardActions();
  const [starredBoards, setStarredBoards] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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

  const fetchStarredBoards = async () => {
    try {
      const response = await handlGetBoardByStarred();
      setStarredBoards(response);
      console.log("response", response);
    } catch (error) {
      console.error("Failed to fetch recent boards", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStarredBoards();
    }
  }, [isOpen]);
  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isOpen ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Starred <MdOutlineArrowDropDown size={20} />
      </button>

      {isOpen && (
        <div className="absolute -top-14 lg:top-full right-full lg:left-0 mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-60 lg:min-w-80 z-10 text-primary dark:text-secondary">
          <ul>
            {starredBoards.length > 0 ? (
              starredBoards?.map((board, index) => (
                <div
                  onClick={() => navigate(`/board/${board.id}`)}
                  key={index}
                  className="flex gap-2 items-center w-full group p-2 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
                >
                  <img
                    src={board?.background}
                    alt=""
                    className="w-9 h-6 object-cover object-center rounded-sm"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-sm">{board?.title}</span>
                    <div className="items-center gap-2 flex">
                      <span className="inline-block p-1 rounded-sm">
                        <FaStar size={15} color="#eab308" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                You have no starred boards
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Starred;
