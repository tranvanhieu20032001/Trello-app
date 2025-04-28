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
        <div className="flex gap-4 items-center relative">
          <span>Dates:</span>
          <div className="flex gap-1 items-center py-1 px-2 bg-gray-200 rounded-md">
            <IoIosTimer size={18} />
            <span>
              {startDate} - {dueDate}
            </span>
            {!card?.isComplete && dueTime > 0 ? null : card?.isComplete ? (
              <div className="bg-green-500 px-2 text-white rounded-md">
                Complete
              </div>
            ) : (
              <div className="bg-red-500 px-2 text-white rounded-md">
                Overdue
              </div>
            )}

            <IoIosArrowDown size={18} onClick={() => setIsOpen(true)} />
          </div>
          {isOpen && (
            <DateModal
              card={card}
              onClose={() => setIsOpen(false)}
              position="top-full"
            />
          )}
        </div>
      )}
    </>
  );
};

export default DatesCart;
