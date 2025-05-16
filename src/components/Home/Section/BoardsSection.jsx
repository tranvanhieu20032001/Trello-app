import React, { useEffect, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { FaRegStar, FaStar } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlinePublic, MdOutlineWorkspaces } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import { getWorkspaceByUser_API } from "~/apis";
import { useSelector } from "react-redux";

const BoardsSection = () => {
  const { handlGetBoardByRecent, handlGetBoardByStarred } = useBoardActions();
  const [starredBoards, setStarredBoards] = useState([]);
  const [recentBoards, setRecentBoards] = useState([]);
  const [yourWorkspaces, setYourWorkspaces] = useState([]);
  const [guestWorkspaces, setGuestWorkspaces] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchRecentBoards();
    fetchStarredBoards();
    fetchData();
  }, []);

  const fetchRecentBoards = async () => {
    try {
      const response = await handlGetBoardByRecent();
      setRecentBoards(response);
    } catch (error) {
      console.error("Failed to fetch recent boards", error);
    }
  };

  const fetchStarredBoards = async () => {
    try {
      const response = await handlGetBoardByStarred();
      setStarredBoards(response);
    } catch (error) {
      console.error("Failed to fetch starred boards", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getWorkspaceByUser_API();
      const data = response?.data?.data;

      if (data) {
        const yourWps = data.filter((wp) => wp.ownerId === user?.id);
        const guestWps = data.filter((wp) => wp.ownerId !== user?.id);
        setYourWorkspaces(yourWps);
        setGuestWorkspaces(guestWps);
      } else {
        setYourWorkspaces([]);
        setGuestWorkspaces([]);
      }
    } catch (error) {
      setYourWorkspaces([]);
      setGuestWorkspaces([]);
    }
  };

  const renderBoard = (board, index) => (
    <div key={board.id} className="relative">
      <Link
        to={`/board/${board.id}`}
        className="p-1 border rounded-md shadow-md w-56 h-28 relative text-white capitalize overflow-hidden hover:border-blue-500 group block"
      >
        <img
          src={board?.background}
          alt={board?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 text-sm font-medium flex items-center gap-2">
          <span>{board?.title}</span>
          <span>
            {board?.type === "private" ? (
              <CiLock size={15} />
            ) : board?.type === "public" ? (
              <MdOutlinePublic size={15} />
            ) : (
              <PiUsersThreeLight size={15} />
            )}
          </span>
        </div>
      </Link>
    </div>
  );

  const renderWorkspaceItem = (ws) => (
    <div className="mt-4">
      <div key={ws.id} className="py-2 px-4 rounded-md flex items-center gap-3">
        <span className="w-8 h-8 rounded-sm flex justify-center items-center bg-blue-300 uppercase font-semibold">
          {ws.name.charAt(0)}
        </span>
        {ws.name}
      </div>
      {ws?.boards?.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {ws.boards.map((board, index) => renderBoard(board, index))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center">No boards found</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 mx-4 my-8 text-primary">
      <div>
        <h1 className="flex items-center gap-2 mb-2 font-medium">
          <FaRegStar />
          Starred Boards
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {starredBoards.length > 0 ? (
            starredBoards.map((board, index) => renderBoard(board, index))
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No starred boards
            </p>
          )}
        </div>
      </div>

      <div>
        <h1 className="flex items-center gap-2 mb-2 font-medium">
          <BsClockHistory />
          Recently Viewed
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {recentBoards.length > 0 ? (
            recentBoards.map((board, index) => renderBoard(board?.board, index))
          ) : (
            <p className="text-gray-500 text-sm">No recent boards</p>
          )}
        </div>
      </div>
      <div>
        <h1 className="flex items-center gap-2 mb-2 font-medium">
          <MdOutlineWorkspaces /> YOUR WORKSPACES
        </h1>
        {yourWorkspaces.length > 0 ? (
          yourWorkspaces.map(renderWorkspaceItem)
        ) : (
          <div className="text-sm px-4 py-2 text-gray-500">
            No workspaces found
          </div>
        )}
      </div>
      <div>
        <h1 className="flex items-center gap-2 mb-2 font-medium">
          <MdOutlineWorkspaces /> GUEST WORKSPACES
        </h1>
        {guestWorkspaces.length > 0 ? (
          guestWorkspaces.map(renderWorkspaceItem)
        ) : (
          <div className="text-sm px-4 py-2 text-gray-500">
            No workspaces found
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardsSection;
