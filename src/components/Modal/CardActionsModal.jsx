import { useEffect, useState } from "react";
import { CiCalendarDate, CiCircleCheck, CiCreditCard2, CiImageOn } from "react-icons/ci";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineLabel } from "react-icons/md";

function CardModal({ onClose, card, rect }) {
  const [style, setStyle] = useState({});

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

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed z-50 flex gap-4"
        style={{
          top: rect.top,
          left: rect.left,
        }}
      >
        <div
          style={{ width: rect.width, height:rect.height }}
          className="bg-white rounded-md shadow-lg"
        >
          {card?.cover && (
            <img
              src={card?.cover}
              alt="Cover"
              className="h-auto rounded-t-md object-cover"
            />
          )}
          <h1 className="font-normal text-[13px] px-2 py-2 flex items-center gap-2">
            {card?.title}
          </h1>
        </div>
        <div className="space-y-3 flex flex-col items-start">
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <CiCreditCard2 size={18} />
            Open card
          </div>
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <MdOutlineLabel size={18} />
            Edit labels
          </div>
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <CiImageOn size={18} />
            Change cover
          </div>
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <CiCalendarDate size={18} />
            Edit dates
          </div>
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <HiOutlineArrowSmallRight size={18} />
            Move
          </div>
          <div className="flex items-center bg-white py-1.5 px-3 gap-2 rounded-md hover:scale-105">
            <IoCopyOutline size={18} />
            Copy card
          </div>
        </div>
      </div>
    </>
  );
}

export default CardModal;
