import React, { useEffect, useState } from "react";
import { BsActivity, BsTextLeft } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineAttachFile, MdOutlineLabel } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import { useSelector } from "react-redux";
import { CiCalendarDate, CiCircleCheck } from "react-icons/ci";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import TitleCard from "../Cards/CardModal/TitleCard";
import LoaderSearch from "../Loader/LoaderSearch";
import Loading from "../Loader/Loading";
import CoverCardImg from "../Cards/CardModal/CoverCardImg";

const CardDetailsModal = ({ card, onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const boardData = useSelector((state) => state.board?.board?.data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (card && boardData?.columns) {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [card, boardData]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-[2px] px-4 py-10 overflow-y-auto">
      {!isLoading ? (
        <>
          <div className="absolute inset-0" onClick={onClose}></div>
          <div
            className="relative z-10 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              <IoCloseOutline size={24} />
            </button>

            <CoverCardImg card={card}/>
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-3 space-y-5">
                <TitleCard card={card} boards={boardData} />
                <div className="space-y-2">
                  <span className="font-medium text-base flex items-center gap-2">
                    <BsTextLeft size={20} />
                    Descriptions
                  </span>
                  <div className="p-4 rounded-md bg-gray-100">
                    Add a more detailed description...
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-base flex items-center gap-2">
                      <MdOutlineAttachFile size={20} />
                      Attachments
                    </span>
                    <button className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm">
                      Add
                    </button>
                  </div>
                  <p className="text-center">No Attachments</p>
                </div>
                <hr />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-base flex items-center gap-2">
                      <GoCommentDiscussion size={20} />
                      Comments
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {user?.avatar ? (
                      <img
                        className="w-7 h-7 rounded-full border"
                        src={user?.avatar}
                        alt=""
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white">
                        {user?.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="p-2 w-full rounded-md bg-gray-100 text-sm">
                      Write a comment...
                    </div>
                  </div>
                </div>
                <hr />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-base flex items-center gap-2">
                      <BsActivity size={20} />
                      Activity
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 space-y-5">
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <AiOutlineUserAdd size={18} />
                  Join
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <AiOutlineUser size={18} />
                  Members
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <MdOutlineLabel size={18} />
                  Labels
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <CiCircleCheck size={18} />
                  Checklist
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <CiCalendarDate size={18} />
                  Edit dates
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300">
                  <MdOutlineAttachFile size={18} />
                  Attachments
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[500px] z-10 w-full max-w-3xl bg-white dark:bg-gray-800 flex items-center justify-center relative">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default CardDetailsModal;
