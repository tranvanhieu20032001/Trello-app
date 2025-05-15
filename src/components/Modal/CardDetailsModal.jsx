import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineAttachFile, MdOutlineLabel } from "react-icons/md";
import {
  CiCalendarDate,
  CiCircleCheck,
  CiImageOn,
  CiLogout,
} from "react-icons/ci";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getCardById_API,
  joinCard_API,
  leaveCard_API,
  uploadAttachmentPath_API,
} from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";
import socket from "~/utils/socket";

// Components
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
import MemberCard from "../Cards/CardModal/MemberCard";
import MemberCardModal from "./MemberCardModal";
import AttachmentModal from "./AttachmentModal";
import Attachments from "../Cards/CardModal/Attachments";
import Descriptions from "../Cards/CardModal/Descriptions";
import Comment from "../Cards/CardModal/Comment";
import Activity from "../Cards/CardModal/Activity";
import useDrivePicker from "react-google-drive-picker";
import { LiaGoogleDrive } from "react-icons/lia";
import { toast } from "react-toastify";

const CardDetailsModal = ({ cardId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const boardData = useSelector((state) => state.board?.board?.data);

  const [card, setCard] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    cover: false,
    label: false,
    checklist: false,
    date: false,
    member: false,
    attachment: false,
  });

  const isMember = card?.CardMembers?.some((c) => c.userId === user.id);

  const fetchCard = async () => {
    try {
      const res = await getCardById_API(cardId);
      setCard(res.data);
    } catch (error) {
      console.error("Failed to fetch card:", error);
    }
  };

  const handleFetchData = async () => {
    await fetchCard();
    if (card?.boardId) dispatch(fetchBoardById(card.boardId));
  };

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

  const closeAllModals = () => {
    setModalState({
      cover: false,
      label: false,
      checklist: false,
      date: false,
      member: false,
      attachment: false,
    });
  };

  const handleJoinCard = async () => {
    await joinCard_API(card?.id);
    await handleFetchData();
  };

  const handleLeaveCard = async () => {
    await leaveCard_API(card?.id);
    await handleFetchData();
  };

  const onClose = () => {
    navigate(`board/${card?.boardId}`);
  };

  useEffect(() => {
    if (cardId) fetchCard();
  }, [cardId]);

  useEffect(() => {
    if (card?.boardId && !boardData) {
      dispatch(fetchBoardById(card.boardId));
    }
  }, [card, boardData, dispatch]);

  useEffect(() => {
    if (card && boardData?.columns) {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [card, boardData]);

  useEffect(() => {
    if (!card?.id) return;
    socket.emit("joinCard", card.id);
    socket.on("notify", handleFetchData);
    return () => socket.off("notify", handleFetchData);
  }, [card?.id]);

  const [openPicker, setOpenPicker] = useDrivePicker();

  const handleOpenPicker = async () => {
    openPicker({
      clientId:
        "641804194023-sq787jqgcp5jl3no43kv6lfvc22fn00f.apps.googleusercontent.com",
      developerKey: "AIzaSyD3M4qDNU8lBac7uRCyJF88-KxNNKEj04A",
      viewId: "DOCS",
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.docs) {
          handleUploadDriveFiles(data.docs);
        }
      },
    });
  };

  const handleUploadDriveFiles = async (files) => {
    try {
      const filePaths = files.map((file) => file.url);
      const filenames = files.map((file) => file.name);

      await uploadAttachmentPath_API(cardId, "DRIVER", filePaths, filenames);
      toast.success("Upload file successfully");
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="h-[500px] w-full max-w-3xl bg-white dark:bg-gray-800 flex items-center justify-center relative rounded-xl">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-[2px] px-4 py-10 overflow-y-auto">
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
          {/* LEFT */}
          <div className="col-span-3 space-y-5">
            <TitleCard card={card} boards={boardData} />
            <MemberCard card={card} />
            <DatesCart card={card} />
            <LabelsCard card={card} />
            <CheckList card={card} boards={boardData} />
            <Descriptions card={card} />
            <Attachments card={card} handleFetchData={handleFetchData} />
            <hr />
            <Comment card={card} board={boardData} />
            <hr />
            <Activity card={card} />
          </div>

          {/* RIGHT */}
          <div className="col-span-1 space-y-5 relative">
            <div
              className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300 cursor-pointer"
              onClick={isMember ? handleLeaveCard : handleJoinCard}
            >
              {isMember ? (
                <CiLogout size={18} />
              ) : (
                <AiOutlineUserAdd size={18} />
              )}
              {isMember ? "Leave" : "Join"}
            </div>

            <SideButton
              icon={<AiOutlineUser size={18} />}
              label="Members"
              onClick={() => handleModalToggle("member")}
            />
            {!card?.cover && (
              <SideButton
                icon={<CiImageOn size={18} />}
                label="Change cover"
                onClick={() => handleModalToggle("cover")}
              />
            )}
            <SideButton
              icon={<MdOutlineLabel size={18} />}
              label="Labels"
              onClick={() => handleModalToggle("label")}
            />
            <SideButton
              icon={<CiCircleCheck size={18} />}
              label="Checklist"
              onClick={() => handleModalToggle("checklist")}
            />
            <SideButton
              icon={<CiCalendarDate size={18} />}
              label="Dates"
              onClick={() => handleModalToggle("date")}
            />
            <SideButton
              icon={<MdOutlineAttachFile size={18} />}
              label="Attachments"
              onClick={() => handleModalToggle("attachment")}
            />
            <SideButton
              icon={<LiaGoogleDrive size={18} />}
              label="Google Driver"
              onClick={handleOpenPicker}
            />

            {modalState.cover && (
              <CoverBgCardModal
                card={card}
                isOpen
                fetchCard={fetchCard}
                onClose={closeAllModals}
              />
            )}
            {modalState.label && (
              <LabelModal
                card={card}
                board={boardData}
                isOpen
                onClose={closeAllModals}
                handleFetchData={handleFetchData}
              />
            )}
            {modalState.checklist && (
              <AddCheckListModal
                card={card}
                board={boardData}
                onClose={closeAllModals}
              />
            )}
            {modalState.date && (
              <DateModal card={card} onClose={closeAllModals} />
            )}
            {modalState.member && (
              <MemberCardModal
                card={card}
                board={boardData}
                onClose={closeAllModals}
              />
            )}
            {modalState.attachment && (
              <AttachmentModal card={card} onClose={closeAllModals} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SideButton = ({ icon, label, onClick }) => (
  <div
    className="flex items-center bg-gray-100 py-1.5 px-3 gap-2 rounded-md hover:bg-gray-300 cursor-pointer"
    onClick={onClick}
  >
    {icon}
    {label}
  </div>
);

export default CardDetailsModal;
