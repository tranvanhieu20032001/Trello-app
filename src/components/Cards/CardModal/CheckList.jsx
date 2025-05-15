import React, { useState } from "react";
import { FiCheckSquare } from "react-icons/fi";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import {
  addChecklistItem_API,
  removeCheckList_API,
  removeCheckListItem_API,
  toggleChecklistItem_API,
} from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";

const CheckList = ({ card, boards }) => {

  const dispatch = useDispatch();

  const [addItemMap, setAddItemMap] = useState({});
  const [inputValueMap, setInputValueMap] = useState({});
  const [visibleItemsMap, setVisibleItemsMap] = useState({});

  const toggleAddItem = (checklistId) => {
    setAddItemMap((prev) => ({
      ...prev,
      [checklistId]: !prev[checklistId],
    }));
  };

  const handleInputChange = (checklistId, value) => {
    setInputValueMap((prev) => ({
      ...prev,
      [checklistId]: value,
    }));
  };

  const handleAddItem = async (checklistId) => {
    const value = inputValueMap[checklistId]?.trim();
    if (!value) return;
    await addChecklistItem_API(checklistId, value);
    dispatch(fetchBoardById(boards?.id));
    setInputValueMap((prev) => ({ ...prev, [checklistId]: "" }));
    setAddItemMap((prev) => ({ ...prev, [checklistId]: true }));
    setVisibleItemsMap((prev) => ({
      ...prev,
      [checklistId]: !(prev[checklistId] ?? true),
    }));
  };

  const handleCheckItem = async (itemId) => {
    await toggleChecklistItem_API(itemId);
    dispatch(fetchBoardById(boards?.id));
  };

  const handleRemoveCheckList = async (checklistId) => {
    await removeCheckList_API(checklistId);
    dispatch(fetchBoardById(boards?.id));
  };

  const handleRemoveCheckListItem = async (itemId) => {
    await removeCheckListItem_API(itemId);
    dispatch(fetchBoardById(boards?.id));
  };

  const toggleVisibleItems = (checklistId) => {
    setVisibleItemsMap((prev) => ({
      ...prev,
      [checklistId]: !(prev[checklistId] ?? true),
    }));
  };

  return (
    <div className="space-y-6">
      {card?.checklists.map((checklist) => {
        const completed = checklist?.items.filter((i) => i.isChecked).length;
        const totalItems = checklist?.items.length;
        const progress =
          totalItems === 0 ? 0 : Math.round((completed / totalItems) * 100);

        const isVisible = visibleItemsMap[checklist.id] ?? true;

        return (
          <div key={checklist.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-base flex items-center gap-2">
                <FiCheckSquare size={20} />
                {checklist.title}
              </span>
              <button
                className="text-sm bg-gray-200 text-primary border border-gray-300 px-2 py-1 rounded-sm"
                onClick={() => handleRemoveCheckList(checklist.id)}
              >
                Remove
              </button>
            </div>

            <div className="flex items-center gap-4">
              {progress > 0 ? progress + "%" : ""}
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {checklist?.items.length > 0 && (
                <button onClick={() => toggleVisibleItems(checklist.id)}>
                  {isVisible ? (
                    <GoChevronUp size={20} />
                  ) : (
                    <GoChevronDown size={20} />
                  )}
                </button>
              )}
            </div>

            {isVisible && (
              <div className="mt-2">
                {checklist?.items
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 py-1.5 px-3 rounded-md group"
                    >
                      <input
                        type="checkbox"
                        checked={item?.isChecked}
                        onChange={() => handleCheckItem(item?.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex justify-between flex-grow">
                        <p
                          className={
                            item?.isChecked ? "line-through text-gray-500" : ""
                          }
                        >
                          {item.text}
                        </p>
                        <LiaTimesSolid
                          size={18}
                          className="cursor-pointer hidden group-hover:block hover:text-red-500"
                          onClick={() => handleRemoveCheckListItem(item.id)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {!addItemMap[checklist.id] ? (
              <button
                className="text-sm bg-gray-200 text-primary border border-gray-300 px-2 py-1 rounded-sm"
                onClick={() => toggleAddItem(checklist.id)}
              >
                Add Item
              </button>
            ) : (
              <div>
                <input
                  name="title"
                  placeholder="Add new item"
                  autoFocus
                  value={inputValueMap[checklist.id] || ""}
                  onChange={(e) =>
                    handleInputChange(checklist.id, e.target.value)
                  }
                  className="py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 border border-gray-300 focus:border-blue-500 transition w-full"
                  type="text"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="text-sm bg-gray-200 text-primary border border-gray-300 px-2 py-1 rounded-sm"
                    onClick={() => toggleAddItem(checklist.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-sm bg-blue-600 hover:bg-primary text-white border border-blue-600 px-3 py-1 rounded-sm"
                    onClick={() => handleAddItem(checklist.id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default CheckList;
