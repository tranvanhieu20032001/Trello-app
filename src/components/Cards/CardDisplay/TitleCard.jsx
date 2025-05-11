import React, { useEffect, useState } from "react";
import { dateComplete_API } from "~/apis";

const TitleCard = ({ card }) => {
  const [isComplete, setIsComplete] = useState(false);
  const handleDateComplete = async () => {
    const newStatus = !isComplete;
    setIsComplete(newStatus);
    await dateComplete_API(card?.id, newStatus);
  };

  useEffect(() => {
    setIsComplete(card?.isComplete);
  }, [card?.isComplete]);

  return (
    <h1 className="font-normal text-[13px] px-2 py-2 flex items-center gap-2">
      <input
        data-tooltip-id={`complete-${card?.id}`}
        type="checkbox"
        checked={isComplete}
        onClick={(e) => e.stopPropagation()}
        onChange={handleDateComplete}
      />
      {card?.title}
    </h1>
  );
};

export default TitleCard;
