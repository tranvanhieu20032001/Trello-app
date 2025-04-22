import { useEffect, useState } from "react";
import { CiCalendarDate, CiCreditCard2, CiImageOn } from "react-icons/ci";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineLabel } from "react-icons/md";
import { useSelector } from "react-redux";
import CoverBgCardModal from "./CoverBgCardModal";
import LabelModal from "./LabelModal";

function CardModal({ onClose, card, rect, onOpenDetails }) {
  const boardData = useSelector((state) => state.board?.board?.data);
  const [style, setStyle] = useState({});
  const [modalState, setModalState] = useState({
    cover: false,
    label: false,
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
          className="bg-white rounded-md shadow-lg"
        >
          {card?.cover && (
            <img
              src={card?.cover}
              alt="Cover"
              className="h-40 w-full rounded-t-md object-cover"
            />
          )}
          <h1 className="font-normal text-[13px] px-2 py-2 flex items-center gap-2">
            {card?.title}
          </h1>
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
          />
          <ActionButton
            icon={<HiOutlineArrowSmallRight size={18} />}
            label="Move"
          />
          <ActionButton icon={<IoCopyOutline size={18} />} label="Copy card" />

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
        </div>
      </div>
    </>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <div
      className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
}

export default CardModal;
