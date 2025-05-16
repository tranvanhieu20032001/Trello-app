import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import CoverBgCardModal from "~/components/Modal/CoverBgCardModal";

const CoverCardImg = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-center">
      <div className="relative group">
        {card?.cover && (
          <img
            src={card?.cover}
            alt="Cover"
            className="h-44 w-80 rounded-md object-cover"
          />
        )}

        <button
          className="p-1.5 bg-gray-200 text-primary rounded-full absolute bottom-1.5 right-1.5 hidden group-hover:block"
          onClick={() => setIsOpen(true)}
        >
          <CiImageOn size={18} />
        </button>
        {isOpen && (
          <CoverBgCardModal
            card={card}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CoverCardImg;
