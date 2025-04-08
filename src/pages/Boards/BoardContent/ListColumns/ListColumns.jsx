import { MdOutlinePostAdd } from "react-icons/md";
import Column from "./Column/Column";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createColumn_API } from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

function ListColumns({ columns }) {
  // console.log("column", columns);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const [addNewColumn, setAddNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error("Please enter column title");
      return;
    }

    const newColumnData = {
      title: newColumnTitle,
      boardId: boardId,
    };

    try {
      await createColumn_API(newColumnData);
      dispatch(fetchBoardById(boardId));
      toast.success("Column added successfully!");

      setNewColumnTitle("");
      setAddNewColumn(false);
    } catch (error) {
      toast.error("Failed to add column");
    }
  };

  return (
    <SortableContext
      items={columns?.map((column) => column.id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className="listColumns h-full overflow-y-hidden py-4 flex gap-4 px-4 items-start text-primary w-full overflow-x-auto dark:text-secondary text-xs md:text-base">
        {columns?.map((column) => (
          <Column key={column.id} column={column} />
        ))}

        {!addNewColumn ? (
          <button
            onClick={() => setAddNewColumn(true)}
            className="min-w-64 bg-gray-100 dark:bg-gray-800 gap-1 rounded-md py-1.5 text-sm shadow-md flex items-center justify-center cursor-pointer"
          >
            <MdOutlinePostAdd size={18} />
            <span>Add another list</span>
          </button>
        ) : (
          <div className="min-w-64 bg-gray-100 dark:bg-gray-800 rounded-md p-2 shadow-md">
            <input
              type="text"
              className="w-full text-primary py-1 px-2 rounded-sm text-[15px] border-none focus:outline-[0.5px] focus:outline-blue-600"
              placeholder="Enter list title..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <div className="flex justify-between mt-2 text-xs">
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded-sm"
                onClick={handleAddNewColumn}
              >
                Add List
              </button>
              <button
                className="p-1 rounded-sm text-primary hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setAddNewColumn(false)}
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </SortableContext>
  );
}

export default ListColumns;
