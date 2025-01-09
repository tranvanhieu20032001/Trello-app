import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BsClockHistory } from "react-icons/bs";
import { LiaCommentSolid } from "react-icons/lia";
import { PiPaperclipLight } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import users from "~/data/user";

function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Giảm độ mờ khi kéo
  };
  const extraMembers = card?.memberIds?.slice(4) || [];
  const displayedMembers = card?.memberIds?.slice(0, 4) || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${card.Fe_placeholderCard ? 'h-0':''} card w-full bg-white overflow-hidden dark:bg-gray-600 rounded-md shadow-md cursor-pointer text-primary dark:text-secondary text-xs md:text-sm`}
    >
      {card?.cover && (
        <img
          src={card?.cover}
          alt="Cover"
          className="h-auto rounded-t-md object-cover"
        />
      )}

      <h1 className="font-normal text-[13px] px-2 py-2">
        {card?.title}
      </h1>
      {card?.start_date && (
        <span className="text-[10px] lg:text-xs inline-flex items-center gap-2 mx-2 px-2 pb-2 text-green-500 rounded-sm">
          <BsClockHistory size={12} />
          {card?.start_date}
        </span>
      )}

      {(card?.memberIds?.length > 0 ||
        card?.comments?.length > 0 ||
        card?.attachments?.length > 0) && (
        <div className="flex items-center justify-around pb-2">
          <span className="flex items-center px-2">
            {displayedMembers.map((memberId) => (
              <img
                key={memberId}
                className="w-5 h-5 rounded-full border -ml-1"
                src={users.find((user) => user?.id === memberId)?.avatar}
                alt="User avatar"
              />
            ))}

            {extraMembers.length > 0 && (
              <span
                id="memberIds"
                className="w-5 h-5 rounded-full border -ml-1 text-[10px] flex items-center justify-center"
              >
                +{extraMembers?.length}
              </span>
            )}

            {extraMembers?.length > 0 && (
              <Tooltip
                anchorSelect="#memberIds"
                clickable
                className="z-10 text-[4px]"
                place="bottom"
              >
                {extraMembers.join(", ")}
              </Tooltip>
            )}
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
    </div>
  );
}
export default Card;
