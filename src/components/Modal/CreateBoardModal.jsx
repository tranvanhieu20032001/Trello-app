import { useEffect, useRef, useState } from "react";
import board from "~/assets/board-exam.svg";
import { createBoard_API, getWorkspaceByUser_API } from "~/apis";
import { IoAdd } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";

const backgroundImage = [
  "https://trello-app-umber.vercel.app//assets/background/astronaaut.png",
  "https://trello-app-umber.vercel.app//assets/background/food.jpg",
  "https://trello-app-umber.vercel.app//assets/background/lantern02.jpg",
  "https://trello-app-umber.vercel.app//assets/background/lanterns01.jpg",
  "https://trello-app-umber.vercel.app//assets/background/mountain01.jpg",
  "https://trello-app-umber.vercel.app//assets/background/natural.jpg",
  "https://trello-app-umber.vercel.app//assets/background/seagull.jpg",
  "https://trello-app-umber.vercel.app//assets/color1.svg",
  "https://trello-app-umber.vercel.app//assets/color2.svg",
  "https://trello-app-umber.vercel.app//assets/color3.svg",
  "https://trello-app-umber.vercel.app//assets/color4.svg",
  "https://trello-app-umber.vercel.app//assets/color5.svg",
];

const visibility = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "workspace", label: "Workspace" },
];

const CreateBoardModal = ({
  isOpen,
  onClose,
  position = "top-full left-0",
}) => {
  const [selectedBg, setSelectedBg] = useState(backgroundImage[0]);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState({
    id: "",
    name: "",
  });
  const [boardTitle, setBoardTitle] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState(
    visibility[1].label
  );
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

  const workspaceRef = useRef(null);
  const visibilityRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWorkspaceByUser_API();
        if (response?.data?.data) {
          setWorkspaces(response.data.data);
          setSelectedWorkspace(
            response.data.data[0] || { id: "", name: "No workspace available" }
          );
        } else {
          setWorkspaces([]);
        }
      } catch (error) {
        setWorkspaces([]);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCreateBoard = async () => {
    if (boardTitle) {
      const boardData = {
        title: boardTitle,
        background: selectedBg,
        ownerId: user.id,
        workspaceId: selectedWorkspace.id,
        type: visibility.find((v) => v.label === selectedVisibility)?.value,
      };

      try {
        const response = await createBoard_API(boardData);
        toast.success(response.data.message);
        navigate(`/board/${response.data.data.id}`);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setBoardTitle("")
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${position} bg-light dark:bg-gray-700 border border-gray-200 p-3 rounded-md min-w-64 z-10 shadow-lg`}
    >
      <div
        className="flex items-center justify-center w-full h-32 rounded-md mb-3 border"
        style={{
          backgroundImage: `url(${selectedBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img src={board} alt="Board" />
      </div>

      <h2 className="py-2 text-sm font-semibold">Choose a background:</h2>
      <div className="grid grid-cols-4 gap-2">
        {backgroundImage.map((bg, index) => (
          <button
            key={index}
            className={`w-12 h-12 rounded-md border ${
              selectedBg === bg
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-300"
            } hover:ring-2 ring-blue-500`}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => setSelectedBg(bg)}
          />
        ))}
      </div>

      <h2 className="pt-4 pb-1 text-sm font-semibold">Board title</h2>
      <input
        type="text"
        placeholder="Enter board title"
        value={boardTitle}
        onChange={(e) => setBoardTitle(e.target.value)}
        className="p-1.5 rounded-md block w-full border border-gray-200 outline-none dark:bg-gray-700"
      />
      {!boardTitle && (
        <span className="text-sm text-red-500">👋 Board title is required</span>
      )}

      {/* Chọn Workspace */}
      <h2 className="pt-4 pb-1 text-sm font-semibold">Workspace</h2>
      <div ref={workspaceRef} className="relative">
        <button
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="p-2 w-full flex justify-between items-center border border-gray-300 rounded-md"
        >
          {selectedWorkspace.name} <IoIosArrowDown size={14} />
        </button>
        {isWorkspaceOpen && workspaces.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg z-10">
            {workspaces.map((workspace) => (
              <li
                key={workspace.id}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => {
                  setSelectedWorkspace(workspace);
                  setIsWorkspaceOpen(false);
                }}
              >
                {workspace.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chọn Visibility */}
      <h2 className="pt-4 pb-1 text-sm font-semibold">Visibility</h2>
      <div ref={visibilityRef} className="relative">
        <button
          onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
          className="p-2 w-full flex justify-between items-center border border-gray-300 rounded-md"
        >
          {selectedVisibility} <IoIosArrowDown size={14} />
        </button>
        {isVisibilityOpen && (
          <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg z-10">
            {visibility.map((visib, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => {
                  setSelectedVisibility(visib.label);
                  setIsVisibilityOpen(false);
                }}
              >
                {visib.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        disabled={!boardTitle}
        onClick={handleCreateBoard}
        className={`my-3 w-full flex items-center justify-center px-2 py-1.5 text-white border rounded-md ${
          boardTitle
            ? "bg-blue-600 hover:bg-primary"
            : "bg-gray-400 opacity-50 cursor-not-allowed"
        }`}
      >
        <IoAdd size={20} />
        Create board
      </button>
    </div>
  );
};

export default CreateBoardModal;
