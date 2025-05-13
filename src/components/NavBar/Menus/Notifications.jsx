import React, { useEffect, useRef, useState } from "react";
import { BsBell } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { getNotifications_API } from "~/apis";
import { generateNotificationsMessage } from "~/utils/hooks/generateNotificationsMessage";
import { formatUploadTime } from "~/utils/formatters";
import { useSelector } from "react-redux";
import socket from "~/utils/socket";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await getNotifications_API();
        setNotifications(res.data);
        console.log("Notifications:", res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const handleNotification = (data) => {
      fetchNotifications();
    };

    socket.emit("joinUser", user.id);
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user?.id]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <div
        id="notify"
        className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsBell size={20} />
        {unreadNotifications.length > 0 && !showUnreadOnly && (
          <span className="absolute w-2 h-2 rounded-full bg-red-600 top-2 right-2"></span>
        )}
      </div>

      {isOpen && (
        <div className="absolute -top-14 lg:top-full right-full lg:right-0 mt-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md min-w-72 lg:min-w-80 z-10 shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <div className="flex items-center justify-between mt-2 text-xs">
                <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600">
                  Mark all as read
                </button>
                <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-500"
                    checked={showUnreadOnly}
                    onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  />
                  <span className="ml-2">Only unread</span>
                </label>
              </div>
            )}
          </div>
          <ul className="overflow-y-auto max-h-96">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  onClick={() => navigate(`card/${notification?.data?.cardId}`)}
                  key={notification?.id}
                  className={`px-2 py-1 flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    !notification?.isRead ? "bg-blue-100 dark:bg-gray-900" : ""
                  }`}
                >
                  {notification?.actor.avatar ? (
                    <img
                      className="w-7 h-7 rounded-full border mt-2"
                      src={notification?.actor.avatar}
                      alt=""
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white">
                      {notification?.actor?.username?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification?.actor.username}
                      </span>{" "}
                      <span>{generateNotificationsMessage(notification?.type, notification?.data)}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatUploadTime(notification?.createdAt)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-4 text-center text-gray-600 dark:text-gray-400">
                No new notifications
              </li>
            )}
          </ul>
        </div>
      )}
      <Tooltip anchorSelect="#notify" clickable className="z-10">
        Notifications
      </Tooltip>
    </div>
  );
};

export default Notifications;
