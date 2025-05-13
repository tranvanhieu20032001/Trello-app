import { useEffect, useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useBoardActions } from "~/utils/hooks/useBoardActions";

function Recent() {
  const { handlGetBoardByRecent } = useBoardActions();
  const [isOpen, setIsOpen] = useState(false);
  const [recentBoards, setRecentBoards] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isOpen) {
      fetchRecentBoards();
    }
  }, [isOpen]);

  const fetchRecentBoards = async () => {
    try {
      const response = await handlGetBoardByRecent();
      setRecentBoards(response);
      console.log("response", response);
      
    } catch (error) {
      console.error("Failed to fetch recent boards", error);
    }
  };

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
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isOpen ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Recent <MdOutlineArrowDropDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute -top-4 lg:top-full right-full lg:left-0 mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-60 lg:min-w-80 z-10 text-primary dark:text-secondary">
          <ul>
            {recentBoards.length > 0 ? (
              recentBoards?.map((board, index) => (
                <div
                  onClick={() => navigate(`/board/${board.board.id}`)}
                  key={index}
                  className="flex gap-2 items-center w-full group p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
                >
                  <img
                    src={board?.board?.background}
                    alt=""
                    className="w-9 h-6 object-cover object-center rounded-sm"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-sm">{board?.board?.title}</span>
                    <div className="items-center gap-2 hidden group-hover:flex">
                      <span className="inline-block p-1 rounded-sm">
                        {!board?.board?.UserBoardPreference[0]?.starred ? (
                          <FaRegStar className="" size={15} />
                        ) : (
                          <FaStar size={15} color="#eab308" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                You have no recent boards
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Recent;
