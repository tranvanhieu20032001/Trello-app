import React, { useState } from "react";

const AddNewWorkspace = ({ isOpen, onClose, onAdd }) => {
  const [workspaceTitle, setWorkspaceTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (workspaceTitle.trim()) {
      onAdd(workspaceTitle);
      setWorkspaceTitle("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="py-4">
          <input
            type="text"
            className="w-full py-1 px-2 rounded-sm text-primary text-[15px] border focus:outline-[0.5px] focus:outline-blue-600"
            placeholder="Enter workspace title..."
            value={workspaceTitle}
            onChange={(e) => setWorkspaceTitle(e.target.value)}
          />
          <div className="flex justify-end mt-2 text-xs">
            <button
              className="px-2 py-2 bg-blue-600 text-white rounded-sm hover:bg-primary"
              onClick={handleSubmit}
            >
              Add workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewWorkspace;
