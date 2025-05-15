import React from "react";
import { useNavigate } from "react-router-dom";
import { markNotifitionAsRead_API } from "~/apis";
import { formatUploadTime } from "~/utils/formatters";

const NotificationItem = ({ notification, fetchNotifications }) => {
  const navigate = useNavigate();

  const getMessageContent = () => {
    switch (notification?.type) {
      case "TAGGED_IN_COMMENT":
        return <>tagged you in a comment</>;

      case "ADDED_TO_CARD":
        return (
          <>
            added you to the card{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.cardName}
            </span>
          </>
        );

      case "REMOVED_FROM_CARD":
        return (
          <>
            removed you from the card{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.cardName}
            </span>
          </>
        );

      case "LEAVED_CARD":
        return (
          <>
            left the card{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.cardName}
            </span>
          </>
        );

      case "COMPLETE_CARD":
        return (
          <>
            marked the card{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.cardName}
            </span>{" "}
            as complete
          </>
        );

      case "INCOMPLETE_CARD":
        return (
          <>
            marked the card{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.cardName}
            </span>{" "}
            as incomplete
          </>
        );

      case "ADDED_TO_BOARD":
        return (
          <>
            added you to the board{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.boardName}
            </span>
          </>
        );

      case "REMOVE_FROM_BOARD":
        return (
          <>
            removed you from the board{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.boardName}
            </span>
          </>
        );

      case "LEAVED_BOARD":
        return (
          <>
            left the board{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.boardName}
            </span>
          </>
        );

      case "ADDED_TO_WORKSPACE":
        return (
          <>
            added you to the workspace{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.workSpaceName}
            </span>
          </>
        );

      case "REMOVE_FROM_WORKSPACE":
        return (
          <>
            removed you from the workspace{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.workSpaceName}
            </span>
          </>
        );

      case "LEAVED_WORKSPACE":
        return (
          <>
            left the workspace{" "}
            <span className="font-semibold text-blue-500 hover:underline">
              {notification?.data?.workSpaceName}
            </span>
          </>
        );

      default:
        return <>performed an action</>;
    }
  };

  const handleClick = () => {
    if (!notification?.isRead) {
      markNotifitionAsRead_API(notification.id);
    }

    // Chuyển hướng phù hợp
    switch (notification?.type) {
      case "TAGGED_IN_COMMENT":
      case "ADDED_TO_CARD":
      case "REMOVED_FROM_CARD":
      case "LEAVED_CARD":
      case "COMPLETE_CARD":
      case "INCOMPLETE_CARD":
        navigate(`/card/${notification?.data?.cardId}`);
        break;

      case "ADDED_TO_BOARD":
      case "REMOVE_FROM_BOARD":
      case "LEAVED_BOARD":
        navigate(`/board/${notification?.data?.boardId}`);
        break;

      case "ADDED_TO_WORKSPACE":
      case "REMOVE_FROM_WORKSPACE":
      case "LEAVED_WORKSPACE":
        navigate(`/workspace/${notification?.data?.workspaceId}`);
        break;

      default:
        break;
    }
    fetchNotifications();
  };

  return (
    <li
      key={notification?.id}
      onClick={handleClick}
      className={`px-2 py-1 flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer ${
        !notification?.isRead ? "bg-blue-100 dark:bg-gray-900" : ""
      }`}
    >
      {notification?.actor?.avatar ? (
        <img
          className="w-7 h-7 rounded-full border mt-2"
          src={notification?.actor.avatar}
          alt="avatar"
        />
      ) : (
        <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white mt-2">
          {notification?.actor?.username?.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex-grow">
        <p className="text-sm">
          <span className="font-semibold">{notification?.actor?.username}</span>{" "}
          {getMessageContent()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatUploadTime(notification?.createdAt)}
        </p>
      </div>
    </li>
  );
};

export default NotificationItem;
