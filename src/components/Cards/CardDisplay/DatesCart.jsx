import React, { useState } from "react";
import { IoIosArrowDown, IoIosTimer } from "react-icons/io";
import DateModal from "~/components/Modal/DateModal";

const DatesCart = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dueTime = new Date(card?.dueDate).getTime() - Date.now();

  const startDate = new Date(card?.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const dueDate = new Date(card?.dueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {!!card?.startDate && (
        <div
          className={`flex gap-1 w-fit mx-2 items-center relative text-xs p-0.5 bg-gray-200 rounded-md ${
            !card?.isComplete && dueTime > 0
              ? null
              : card?.isComplete
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <IoIosTimer size={12} />
          <span>
            {startDate} - {dueDate}
          </span>
        </div>
      )}
    </>
  );
};

export default DatesCart;
