import { useEffect, useState } from "react";
import {
  CiCalendarDate,
  CiCircleCheck,
  CiCreditCard2,
  CiImageOn,
} from "react-icons/ci";
import { MdOutlineLabel } from "react-icons/md";
import { useSelector } from "react-redux";
import CoverBgCardModal from "./CoverBgCardModal";
import LabelModal from "./LabelModal";
import TitleCard from "../Cards/CardDisplay/TitleCard";
import DatesCart from "../Cards/CardDisplay/DatesCart";
import LabelsCard from "../Cards/CardDisplay/LabelsCard";
import CardFooter from "../Cards/CardDisplay/CardFooter";
import DateModal from "./DateModal";

function CardModal({ onClose, card, rect, onOpenDetails }) {
  const boardData = useSelector((state) => state.board?.board?.data);
  const [style, setStyle] = useState({});
  const [modalState, setModalState] = useState({
    cover: false,
    label: false,
    checklist: false,
    date: false,
    member: false,
    attachment: false,
  });

  useEffect(() => {
    if (rect) {
      setStyle({
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        transformOrigin: "top left",
        zIndex: 50,
        transition: "transform 0.2s ease",
      });
    }
  }, [rect]);

  const handleModalToggle = (type) => {
    setModalState({
      cover: type === "cover",
      label: type === "label",
      checklist: type === "checklist",
      date: type === "date",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed z-50 flex gap-4"
        style={{ top: rect.top, left: rect.left }}
      >
        <div
          style={{ width: rect.width, height: rect.height }}
          className="bg-white dark:bg-gray-600 rounded-md shadow-lg"
        >
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

        <div className="space-y-3 flex flex-col items-start">
          <ActionButton
            icon={<CiCreditCard2 size={18} />}
            label="Open card"
            onClick={onOpenDetails}
          />
          <ActionButton
            icon={<MdOutlineLabel size={18} />}
            label="Edit labels"
            onClick={() => handleModalToggle("label")}
          />
          <ActionButton
            icon={<CiImageOn size={18} />}
            label="Change cover"
            onClick={() => handleModalToggle("cover")}
          />
          <ActionButton
            icon={<CiCalendarDate size={18} />}
            label="Edit dates"
            onClick={() => handleModalToggle("date")}
          />

          {modalState.cover && (
            <CoverBgCardModal
              card={card}
              isOpen
              onClose={() => setModalState({ cover: false, label: false })}
            />
          )}
          {modalState.label && (
            <LabelModal
              card={card}
              board={boardData}
              isOpen
              onClose={() => setModalState({ cover: false, label: false })}
            />
          )}

          {modalState.date && (
            <DateModal
              card={card}
              onClose={() =>
                setModalState({
                  cover: false,
                  label: false,
                  checklist: false,
                  date: false,
                  member: false,
                  attachment: false,
                })
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <div
      className="flex items-center bg-white dark:bg-gray-600 py-1.5 px-3 gap-2 rounded-md hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
}

export default CardModal;
