import HeaderWorkspaceContent from "../Header/HeaderWorkspaceContent";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { IoIosAdd, IoIosArrowDown } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { CiLock } from "react-icons/ci";
import { MdOutlinePublic } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { FaRegStar, FaStar } from "react-icons/fa6";
import nofund from "~/assets/nofund.svg";
import CreateBoardModal from "~/components/Boards/CreateBoardModal";
import { IoClose } from "react-icons/io5";
import ViewBoardClose from "../../Modal/ViewBoardClose";

const BoardsContent = () => {
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("a-z");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isViewBoardCloseOpen, setIsViewBoardCloseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const userBoardsOpen = workspaceData?.boards.filter((wpb) => wpb.status);
  const userBoardsClose = workspaceData?.boards.filter((wpb) => !wpb.status);

  // Sắp xếp boards theo sortOrder
  const sortedBoards = [...userBoardsOpen].sort((a, b) => {
    if (sortOrder === "a-z") return a.title.localeCompare(b.title);
    if (sortOrder === "z-a") return b.title.localeCompare(a.title);
    if (sortOrder === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const filteredBoards = sortedBoards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="py-8 px-20">
      <HeaderWorkspaceContent />
      <hr className="my-4" />
      <h1 className="font-medium text-lg">Boards</h1>

      <div className="flex items-center justify-between mt-4">
        {/* Sort Dropdown */}
        <div className="relative w-48 text-sm" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-1.5 w-full flex justify-between items-center border border-gray-300 rounded-md bg-white"
          >
            {sortOrder === "a-z" && "Alphabetically A-Z"}
            {sortOrder === "z-a" && "Alphabetically Z-A"}
            {sortOrder === "newest" && "Most recently active"}
            {sortOrder === "oldest" && "Least recently active"}
            <IoIosArrowDown size={14} />
          </button>
          {isDropdownOpen && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {["a-z", "z-a", "newest", "oldest"].map((order) => (
                <li
                  key={order}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSortOrder(order);
                    setIsDropdownOpen(false);
                  }}
                >
                  {order === "a-z" && "Alphabetically A-Z"}
                  {order === "z-a" && "Alphabetically Z-A"}
                  {order === "newest" && "Most recently active"}
                  {order === "oldest" && "Least recently active"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <input
            className="w-60 border text-sm px-2 py-1.5 border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredBoards.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {filteredBoards.map((board) => (
              <Link
                to={`/board/${board.id}`}
                key={board.id}
                className="p-1 border rounded-md shadow-md w-56 h-28 relative text-white capitalize overflow-hidden hover:border-blue-500 group"
              >
                <img
                  src={board?.background}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-sm font-medium">
                  {board?.title}
                </span>
                <span className="absolute bottom-2 left-2">
                  {board?.type === "private" ? (
                    <CiLock size={20} />
                  ) : board?.type === "public" ? (
                    <MdOutlinePublic size={20} />
                  ) : (
                    <PiUsersThreeLight size={20} />
                  )}
                </span>
                <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-500">
                  <IoClose size={20} />
                </span>
                <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-yellow-500">
                  {board?.starred ? (
                    <FaStar size={15} color="#ffd600" />
                  ) : (
                    <FaRegStar size={15} />
                  )}
                </span>
              </Link>
            ))}
            <div
              className="p-1 border rounded-md shadow-md w-56 h-28 relative text-primary flex items-center justify-center cursor-pointer capitalize group bg-slate-200 hover:border-blue-500  group"
              onClick={() => setIsOpen(true)}
            >
              <span className="flex items-center gap-2 text-sm group-hover:scale-105 group-hover:text-blue-500">
                <IoIosAdd size={20} /> Create new board
              </span>
              <CreateBoardModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                position="top-0"
              />
            </div>
          </div>
          {userBoardsClose && userBoardsClose.length > 0 && (
            <>
              <button
                className="my-4 text-[13px] gap-2 font-medium flex items-center px-2 py-1.5 bg-blue-600 text-white hover:bg-primary border border-blue-700 rounded-sm"
                onClick={() => setIsViewBoardCloseOpen(true)}
              >
                View closed boards
              </button>
              {isViewBoardCloseOpen && (
                <ViewBoardClose
                  dataBoard={userBoardsClose}
                  onClose={() => setIsViewBoardCloseOpen(false)}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-gray-500 text-center py-10">
          <img className="w-20 mx-auto" src={nofund} alt="" />
          <p>
            Uh oh, there is no one here by that name. Should there be? Invite
            them now!
          </p>
        </div>
      )}
    </div>
  );
};

export default BoardsContent;
