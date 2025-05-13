import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { closeModal, openModal } from "~/store/slices/modalSlice";

import CardFooter from "~/components/Cards/CardDisplay/CardFooter";
import DatesCart from "~/components/Cards/CardDisplay/DatesCart";
import LabelsCard from "~/components/Cards/CardDisplay/LabelsCard";
import TitleCard from "~/components/Cards/CardDisplay/TitleCard";
import CardActionsModal from "~/components/Modal/CardActionsModal";

function Card({ card }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef();

  const [modalOpen, setModalOpen] = useState(false);
  const [cardRect, setCardRect] = useState(null);

  const handleOpenActionsModal = (e) => {
    e.stopPropagation();
    const rect = cardRef.current.getBoundingClientRect();
    setCardRect(rect);
    setModalOpen(true);
    dispatch(openModal());
  };

  const handleOpenDetailsModal = () => {
    navigate(`/card/${card.id}`, {
      state: { backgroundLocation: location },
    });
  };

  const handleCloseModals = () => {
    setModalOpen(false);
    dispatch(closeModal());
  };

  const handleOpenDetailsFromActions = () => {
    setModalOpen(false);
    navigate(`/card/${card.id}`);
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
    opacity: isDragging ? 0.3 : 1,
  };

  const showEditButton = !card.Fe_placeholderCard;
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleOpenDetailsModal}
        className={`${
          card.Fe_placeholderCard ? "h-0" : ""
        } card w-full relative bg-white dark:bg-gray-600 rounded-md shadow-md cursor-pointer text-primary dark:text-secondary text-xs md:text-sm group border border-transparent hover:border-blue-500 ${
          modalOpen ? "pointer-events-none" : ""
        }`}
      >
        <div ref={cardRef}>
          {showEditButton && (
            <button
              className="absolute top-1.5 right-3 bg-gray-200 text-black p-1.5 rounded-full hidden group-hover:flex items-center justify-center"
              onClick={handleOpenActionsModal}
            >
              <BiSolidEditAlt />
            </button>
          )}

          {card?.cover && (
            <img
              src={card.cover}
              alt="Cover"
              className="h-40 w-full object-cover rounded-t-md"
            />
          )}

          <TitleCard card={card} />
          {card.startDate && card.dueDate && <DatesCart card={card} />}
          {card.labels?.length > 0 && <LabelsCard card={card} />}
          <CardFooter card={card} />
        </div>
      </div>

      {modalOpen && (
        <CardActionsModal
          card={card}
          rect={cardRect}
          onClose={handleCloseModals}
          onOpenDetails={handleOpenDetailsFromActions}
        />
      )}

      <Tooltip
        id={`complete-${card.id}`}
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
