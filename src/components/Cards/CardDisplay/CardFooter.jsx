import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { LiaCommentSolid } from "react-icons/lia";
import { PiPaperclipLight } from "react-icons/pi";

const CardFooter = ({ card }) => {
  return (
    <>
      {(card?.CardMembers?.length > 0 ||
        card?.comments?.length > 0 ||
        card?.attachments?.length > 0) && (
        <div className="flex items-center justify-around py-2">
          <span className="flex items-center gap-1 text-xs">
            <AiOutlineUsergroupAdd size={18} />
            {card?.CardMembers?.length}
          </span>

          <span className="flex items-center gap-1 text-xs">
            <LiaCommentSolid size={18} />
            {card?.comments?.length}
          </span>

          <span className="flex items-center gap-1 text-xs">
            <PiPaperclipLight size={18} />
            {card?.attachments?.length}
          </span>
        </div>
      )}
    </>
  );
};

export default CardFooter;
