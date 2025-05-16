import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { createChecklist_API } from "~/apis";

const AddCheckListModal = ({ card, onClose }) => {
  const [titleCheckList, setTitleCheckList] = useState("");
  const dispatch = useDispatch();

  const handleAddChecklist = async () => {
    if (!titleCheckList.trim()) return;
    try {
      await createChecklist_API(card?.id, titleCheckList.trim());
      setTitleCheckList("");
      onClose?.();
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  };

  return (
    <div className="absolute top-0 left-full bg-white dark:bg-gray-600 text-primary dark:text-secondary px-6 py-4 rounded-2xl border shadow-lg w-80 z-50">
      <h1 className="text-center font-medium text-base">Add checklist</h1>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-red-500 text-lg font-bold absolute top-2 right-2"
      >
        <LiaTimesSolid size={20} className="cursor-pointer" />
      </button>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1"
        >
          Title
        </label>
        <input
          name="title"
          autoFocus
          value={titleCheckList}
          onChange={(e) => setTitleCheckList(e.target.value)}
          className="py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 focus:border-blue-500 transition w-full"
          type="text"
        />
        <button
          onClick={handleAddChecklist}
          className="text-sm px-4 py-1 rounded-sm mt-3 float-end border bg-blue-600 text-white border-blue-700 hover:bg-primary"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCheckListModal;
