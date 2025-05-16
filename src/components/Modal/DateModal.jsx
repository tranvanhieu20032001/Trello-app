import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { editDates_API } from "~/apis";

const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateModal = ({ card, onClose, position = "top-0 left-full" }) => {
  const dispatch = useDispatch();
  const [dates, setDates] = useState({
    start: formatDateForInput(card?.startDate),
    due: formatDateForInput(card?.dueDate),
  });

  const [errors, setErrors] = useState({
    start: false,
    due: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDates((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      start: !dates.start,
      due: !dates.due,
    };

    setErrors(newErrors);

    if (newErrors.start || newErrors.due) return;

    try {
      await editDates_API(card?.id, dates);
    } catch (err) {
      console.error("Failed to save dates", err);
    }
  };

  return (
    <div
      className={`absolute ${position} bg-white dark:bg-gray-600 text-primary dark:text-secondary px-6 py-4 rounded-2xl border shadow-lg w-72 z-50`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-center font-medium text-lg flex-grow">
          Dates
        </h1>
        <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
          <LiaTimesSolid size={20} />
        </button>
      </div>

      <div className="w-full">
        <label className="block text-sm text-gray-600 mb-1">Start date</label>
        <input
          type="date"
          name="start"
          value={dates.start}
          onChange={handleChange}
          className={`w-full border px-3 py-1.5 rounded-md text-sm outline-none dark:bg-gray-700 focus:border-blue-500 ${
            errors.start ? "border-red-500" : ""
          }`}
        />
        {errors.start && (
          <span className="text-sm text-red-500">Please choose start date</span>
        )}
      </div>

      <div className="w-full mt-3">
        <label className="block text-sm text-gray-600 mb-1">Due date</label>
        <input
          type="date"
          name="due"
          value={dates.due}
          onChange={handleChange}
          className={`w-full border px-3 py-1.5 rounded-md text-sm outline-none dark:bg-gray-700 focus:border-blue-500 ${
            errors.due ? "border-red-500" : ""
          }`}
        />
        {errors.due && (
          <span className="text-sm text-red-500">Please choose due date</span>
        )}
      </div>

      <button
        className="mt-4 w-full bg-blue-600 text-white py-1.5 rounded-md text-sm hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Save
      </button>
    </div>
  );
};

export default DateModal;
