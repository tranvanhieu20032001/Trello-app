import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiSolidEditAlt } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { PiPaperclipLight } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { dateComplete_API } from "~/apis";
import CardFooter from "~/components/Cards/CardDisplay/CardFooter";
import DatesCart from "~/components/Cards/CardDisplay/DatesCart";
import LabelsCard from "~/components/Cards/CardDisplay/LabelsCard";
import TitleCard from "~/components/Cards/CardDisplay/TitleCard";
import CardActionsModal from "~/components/Modal/CardActionsModal";
import CardDetailsModal from "~/components/Modal/CardDetailsModal";
import { closeModal, openModal } from "~/store/slices/modalSlice";

function Card({ card }) {
  console.log("Card", card);

  const dispatch = useDispatch();

  const cardRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [cardRect, setCardRect] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = cardRef.current.getBoundingClientRect();
    setCardRect(rect);
    setModalOpen(true);
    dispatch(openModal());
  };
  const handleClickModalDetails = () => {
    setModalDetailsOpen(true);
    dispatch(openModal());
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { ...card },
    disabled: modalOpen,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Giảm độ mờ khi kéo
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`${
          card.Fe_placeholderCard ? "h-0" : ""
        } card w-full relative bg-white overflow-hidden dark:bg-gray-600 rounded-md shadow-md cursor-pointer text-primary dark:text-secondary text-xs md:text-sm group border border-transparent hover:border-blue-500 ${
          modalOpen ? "pointer-events-none" : ""
        }`}
        onClick={handleClickModalDetails}
      >
        <div ref={cardRef}>
          <button
            className="absolute top-1.5 text-black rounded-full right-3 bg-gray-200 p-1.5 hidden group-hover:flex items-center justify-center"
            onClick={(e) => handleClick(e)}
          >
            <BiSolidEditAlt />
          </button>
          {card?.cover && (
            <img
              src={card?.cover}
              alt="Cover"
              className="h-40 w-full rounded-t-md object-cover"
            />
          )}

          <TitleCard card={card} />
          {card?.dueDate && card?.startDate && <DatesCart card={card} />}
          {card?.labels && <LabelsCard card={card} />}
          <CardFooter card={card} />
        </div>
      </div>
      {modalOpen && (
        <CardActionsModal
          card={card}
          rect={cardRect}
          onClose={() => {
            setModalOpen(false);
            dispatch(closeModal());
          }}
          onOpenDetails={() => {
            setModalOpen(false);
            setModalDetailsOpen(true);
          }}
        />
      )}

      {modalDetailsOpen && (
        <CardDetailsModal
          card={card}
          onClose={() => {
            setModalDetailsOpen(false);
            dispatch(closeModal());
          }}
        />
      )}
      <Tooltip
        id={`complete-${card?.id}`}
        clickable
        place="bottom"
        className="z-50"
      >
        Make complete
      </Tooltip>
    </>
  );
}
export default Card;
