import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { PiEmpty } from "react-icons/pi";
import {
  createLabel_API,
  removeLabel_API,
  toggleLabel_API,
  updateLabel_API,
} from "~/apis";
import ConfirmAction from "./ConfirmAction";
import { useDispatch } from "react-redux";
import { fetchBoardById } from "~/store/slices/boardSlice";

const LABEL_COLORS = [
  "#61bd4f",
  "#f2d600",
  "#ff9f1a",
  "#eb5a46",
  "#c377e0",
  "#0079bf",
  "#00c2e0",
  "#51e898",
  "#ff78cb",
  "#344563",
  "#b3bac5",
  "#ffab4a",
  "#6deca9",
  "#c4c9cc",
  "#d4f1f9",
  "#fceabb",
  "#fde2e4",
  "#f7d3ec",
  "#dadada",
  "#8c8c8c",
  "#b04632",
  "#89609e",
  "#cd5a91",
  "#4bbf6b",
  "#f5dd29",
  "#ef7564",
  "#5ba4cf",
  "#29cce5",
  "#bebebe",
  "#ff8ed4",
];

const LabelModal = ({ card, board, isOpen, onClose, handleFetchData }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    color: "",
    id: "",
    isVisible: false,
    isUpdate: false,
  });

  const [activeIndex, setActiveIndex] = useState(null);

  const resetForm = () => {
    setForm({ name: "", color: "", id: "", isVisible: false, isUpdate: false });
  };

  const handleCreateLabel = async () => {
    if (!form.name.trim() || !form.color) return; // đảm bảo nhập tên + màu
    await createLabel_API({
      name: form.name.trim(),
      color: form.color,
      boardId: board?.id,
    });
    dispatch(fetchBoardById(board?.id));
    resetForm();
    if (handleFetchData) handleFetchData();
  };

  const handleEditLabel = (label) => {
    setForm({
      name: label?.name || "",
      color: label?.color || "",
      id: label?.id,
      isVisible: true,
      isUpdate: true,
    });
    // Không gọi handleFetchData ở đây vì chỉ mở form edit
  };

  const handleUpdateLabel = async () => {
    if (!form.name.trim() || !form.color) return;
    await updateLabel_API(form.id, {
      name: form.name.trim(),
      color: form.color,
    });
    dispatch(fetchBoardById(board?.id));
    resetForm();
    if (handleFetchData) handleFetchData();
  };

  const handleRemoveLabel = async (labelId) => {
    await removeLabel_API(labelId);
    dispatch(fetchBoardById(board?.id));
    setActiveIndex(null);
    if (handleFetchData) handleFetchData();
  };

  const toggleForm = () => {
    setForm((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
      name: "",
      color: "",
      isUpdate: false,
    }));
    if (handleFetchData) handleFetchData();
  };

  const handleToggleLabel = async (labelId) => {
    await toggleLabel_API({ cardId: card?.id, labelId });
    dispatch(fetchBoardById(board?.id));
    if (handleFetchData) handleFetchData();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-full bg-white px-6 py-4 rounded-2xl border shadow-lg w-80 z-50">
      <div className="flex justify-center items-center mb-4 relative">
        <h1 className="text-center font-medium">Labels</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-lg font-bold absolute top-1 right-2"
          aria-label="Close label modal"
        >
          <LiaTimesSolid size={20} className="cursor-pointer" />
        </button>
      </div>

      <button onClick={toggleForm} className="text-sm text-blue-600 mb-2">
        {form.isVisible ? "← Back" : "+ Create new label"}
      </button>

      {!form.isVisible ? (
        <div className="space-y-2">
          {board?.labels?.length ? (
            board.labels.map((label, index) => (
              <div key={label?.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={card?.labels?.some((l) => l.labelId === label?.id)}
                  onChange={() => handleToggleLabel(label?.id)}
                />
                <div
                  className="h-7 w-full rounded-md flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: label?.color }}
                  onClick={() => handleEditLabel(label)}
                >
                  {label?.name}
                </div>
                <span
                  className="hover:text-red-600"
                  onClick={() => {
                    if (activeIndex !== index) setActiveIndex(index);
                  }}
                >
                  <LiaTimesSolid size={20} className="cursor-pointer" />
                </span>
                <ConfirmAction
                  isOpen={activeIndex === index}
                  onClose={() => setActiveIndex(null)}
                  onConfirm={() => handleRemoveLabel(label?.id)}
                  title="Remove Label"
                  message={`Are you sure you want to remove label <strong>${label?.name}</strong>?`}
                  position="top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2"
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No labels yet.</p>
          )}
          <hr className="py-2" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h1 className="w-20">Color</h1>
            <h1 className="w-28">Title</h1>
          </div>
          <div className="flex items-center gap-2">
            {form.color ? (
              <div
                className="h-8 w-20 rounded-md"
                style={{ backgroundColor: form.color }}
              />
            ) : (
              <div className="h-8 w-20 rounded-md border flex items-center justify-center text-red-500">
                <PiEmpty size={20} />
              </div>
            )}
            <input
              className="py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 border border-gray-300 focus:border-blue-500 transition w-full"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Label title"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {LABEL_COLORS.map((color) => (
              <button
                key={color}
                className={`h-9 border-2 transition rounded-md ${
                  form.color === color ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setForm({ ...form, color })}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <button
            disabled={!form.color || !form.name.trim()}
            onClick={form.isUpdate ? handleUpdateLabel : handleCreateLabel}
            className={`text-sm px-2 py-1 rounded-sm mt-3 float-end border ${
              !form.color || !form.name.trim()
                ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white border-blue-700 hover:bg-primary"
            }`}
          >
            {form.isUpdate ? "Update" : "Create"}
          </button>
        </>
      )}
    </div>
  );
};

export default LabelModal;
