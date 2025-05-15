import React, { useEffect, useRef, useState } from "react";
import { BsBell } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { getNotifications_API, markAsRead_API } from "~/apis";
import { useSelector } from "react-redux";
import socket from "~/utils/socket";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dropdownRef = useRef(null);

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

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications_API();
      setNotifications(res.data);
      console.log("res.data", res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    const handleNotification = () => {
      fetchNotifications();
    };

    socket.emit("joinUser", user.id);
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user?.id]);

  const handleMarkAsRead = async () => {
    try {
      const res = await markAsRead_API();
      if (res) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const filteredNotifications = showUnreadOnly
    ? unreadNotifications
    : notifications;

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
                <button
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
                  onClick={handleMarkAsRead}
                >
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
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} fetchNotifications={fetchNotifications} />
              ))
            ) : (
              <li className="py-4 text-center text-gray-600 dark:text-gray-400">
                No notifications found
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
