import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineAddCard } from "react-icons/md";
import { TbTemplate } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import ListCards from "./ListCards/ListCards";
import mapOrder from "~/utils/sort";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createCard_API, renameList_API } from "~/apis";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoardById } from "~/store/slices/boardSlice";
import { useParams } from "react-router-dom";
import ListActions from "~/components/Modal/ListActions";
import socket from "~/utils/socket";

function Column({ column }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(column?.title);
  const inputRef = useRef(null);
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);

  useEffect(() => {
    if (!column?.id) return;
    const handleFetchBoard = () => dispatch(fetchBoardById(column?.id));
    socket.emit("joinColumn", column?.id);
    socket.on("notifyBoard", handleFetchBoard);
    return () => {
      socket.off("notifyBoard", handleFetchBoard);
    };
  }, [column?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setEdit(false);
        setNewTitle(column?.title);
      }
    };

    if (edit) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [edit, newTitle, column?.title]);

  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const trimmedTitle = newTitle.trim();

      if (!trimmedTitle) {
        setNewTitle(column?.title);
        setEdit(false);
        return;
      }

      if (trimmedTitle !== column?.title) {
        try {
          setNewTitle(trimmedTitle);
          await renameList_API(column?.id, trimmedTitle);
          dispatch(fetchBoardById(boardId));
        } catch (error) {
          toast.error(error.response?.data?.message || "Rename failed");
          setNewTitle(column?.title);
        }
      }

      setTimeout(() => {
        setEdit(false);
      }, 500);
    } else if (e.key === "Escape") {
      setNewTitle(column?.title);
      setEdit(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { ...column },
    disabled: isModalOpen || isMenuOpen,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Giảm độ mờ khi kéo
    height: "100%",
  };

  const cards = mapOrder(column?.cards, column?.cardOrderIds, "id");

  const [addNewCard, setAddNewCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const dispatch = useDispatch();
  const { boardId } = useParams();

  const handleAddNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Please enter card title");
      return;
    }

    const newCardData = {
      title: newCardTitle,
      boardId: boardId,
      columnId: column.id,
    };
    try {
      await createCard_API(newCardData);
      dispatch(fetchBoardById(boardId));
      toast.success("Card added successfully!");
      setAddNewCard(false);
      setNewCardTitle("");
    } catch (error) {
      toast.error("Failed to add card", error);
    }
    setNewCardTitle("");
    setAddNewCard(false);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        className="column w-[17rem] px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2 text-primary dark:text-secondary text-xs md:text-sm"
      >
        <div
          className="flex items-center justify-between relative"
          ref={inputRef}
        >
          {!edit ? (
            <h1
              className="font-medium px-2 py-1 text-sm border border-transparent"
              onClick={() => setEdit(true)}
            >
              {column?.title}
            </h1>
          ) : (
            <input
              className="border outline-none px-2 py-1 text-sm rounded-md font-medium text-primary"
              value={newTitle}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}
          <div data-tooltip-id="listaction" onClick={toggleMenu}>
            <BsThreeDots size={20} />
          </div>
          <Tooltip id="listaction" place="bottom" clickable>
            List actions
          </Tooltip>
          <ListActions
            isOpen={isMenuOpen}
            onClose={closeMenu}
            onRename={() => setEdit(true)}
            onAddCard={() => setAddNewCard(true)}
          />
        </div>

        <ListCards cards={cards} column={column} />
        {!addNewCard ? (
          <div className="flex items-center justify-between">
            <span
              className="flex items-center gap-1 text-xs cursor-pointer"
              onClick={() => setAddNewCard(true)}
            >
              <MdOutlineAddCard size={18} />
              Add a card
            </span>

            <span
              id="newtemplate"
              className="w-6 h-6 flex justify-center items-center rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
            >
              <TbTemplate size={18} />
            </span>

            <Tooltip
              anchorSelect="#newtemplate"
              clickable
              className="z-10"
              place="bottom"
            >
              Create from template
            </Tooltip>
          </div>
        ) : (
          <div className="">
            <input
              type="text"
              className="w-full py-1 px-2 rounded-sm text-primary text-[15px] border-none focus:outline-[0.5px] focus:outline-blue-600"
              placeholder="Enter list title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
            <div className="flex justify-between mt-2 text-xs">
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded-sm"
                onClick={handleAddNewCard}
              >
                Add List
              </button>
              <button
                className="p-1 rounded-sm text-primary hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setAddNewCard(false)}
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
