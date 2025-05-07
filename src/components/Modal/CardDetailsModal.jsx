import React, { useEffect, useState } from "react";
import { BsActivity, BsTextLeft } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineAttachFile, MdOutlineLabel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  CiCalendarDate,
  CiCircleCheck,
  CiImageOn,
  CiLogout,
} from "react-icons/ci";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import TitleCard from "../Cards/CardModal/TitleCard";
import Loading from "../Loader/Loading";
import CoverCardImg from "../Cards/CardModal/CoverCardImg";
import CoverBgCardModal from "./CoverBgCardModal";
import LabelModal from "./LabelModal";
import LabelsCard from "../Cards/CardModal/LabelsCard";
import CheckList from "../Cards/CardModal/CheckList";
import AddCheckListModal from "./AddCheckListModal";
import DateModal from "./DateModal";
import DatesCart from "../Cards/CardModal/DatesCart";
import { joinCard_API, leaveCard_API } from "~/apis";
import MemberCard from "../Cards/CardModal/MemberCard";
import { fetchBoardById } from "~/store/slices/boardSlice";
import MemberCardModal from "./MemberCardModal";
import AttachmentModal from "./AttachmentModal";
import Attachments from "../Cards/CardModal/Attachments";
import Descriptions from "../Cards/CardModal/Descriptions";
import Comment from "../Cards/CardModal/Comment";
import Activity from "../Cards/CardModal/Activity";

const CardDetailsModal = ({ card, onClose }) => {
  console.log("Card", card);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isMember = card?.CardMembers.some((c) => c.userId === user.id);

  const boardData = useSelector((state) => state.board?.board?.data);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    cover: false,
    label: false,
    checklist: false,
    date: false,
    member: false,
    attachment: false,
  });

  const handleModalToggle = (type) => {
    setModalState({
      cover: type === "cover",
      label: type === "label",
      checklist: type === "checklist",
      date: type === "date",
      member: type === "member",
      attachment: type === "attachment",
    });
  };

  const handleJoinCard = async () => {
    await joinCard_API(card?.id);
    dispatch(fetchBoardById(card?.boardId));
  };

  const handleLeaveCard = async () => {
    await leaveCard_API(card?.id);
    dispatch(fetchBoardById(card?.boardId));
  };

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

            <CoverCardImg card={card} />
            <div className="grid grid-cols-4 gap-5">
              <div className="col-span-3 space-y-5">
                <TitleCard card={card} boards={boardData} />
                <MemberCard card={card} />
                <DatesCart card={card} />
                <LabelsCard card={card} />
                <CheckList card={card} boards={boardData} />
                <Descriptions card={card} />
                <Attachments card={card} />
                <hr />
                <Comment card={card} />
                <hr />
                <Activity card={card} />
              </div>
              <div className="col-span-1 space-y-5 relative">
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={isMember ? handleLeaveCard : handleJoinCard}
                >
                  {isMember ? (
                    <>
                      <CiLogout size={18} />
                      Leave
                    </>
                  ) : (
                    <>
                      <AiOutlineUserAdd size={18} />
                      Join
                    </>
                  )}
                </div>
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={() => handleModalToggle("member")}
                >
                  <AiOutlineUser size={18} />
                  Members
                </div>
                {!card?.cover && (
                  <div
                    className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300 relative"
                    onClick={() => handleModalToggle("cover")}
                  >
                    <CiImageOn size={18} />
                    Change cover
                  </div>
                )}
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={() => handleModalToggle("label")}
                >
                  <MdOutlineLabel size={18} />
                  Labels
                </div>
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={() => handleModalToggle("checklist")}
                >
                  <CiCircleCheck size={18} />
                  Checklist
                </div>
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={() => handleModalToggle("date")}
                >
                  <CiCalendarDate size={18} />
                  Dates
                </div>
                <div
                  className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300"
                  onClick={() => handleModalToggle("attachment")}
                >
                  <MdOutlineAttachFile size={18} />
                  Attachments
                </div>
                {modalState.cover && (
                  <CoverBgCardModal
                    card={card}
                    isOpen
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
                {modalState.label && (
                  <LabelModal
                    card={card}
                    board={boardData}
                    isOpen
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
                {modalState.checklist && (
                  <AddCheckListModal
                    card={card}
                    board={boardData}
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
                {modalState.member && (
                  <MemberCardModal
                    card={card}
                    board={boardData}
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

                {modalState?.attachment && (
                  <AttachmentModal
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
