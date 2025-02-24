import React, { useEffect, useRef, useState } from "react";
import { LiaUserCogSolid } from "react-icons/lia";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { PiUserSwitchLight } from "react-icons/pi";

import { Tooltip } from "react-tooltip";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "~/store/slices/authSlice";
import { toast } from "react-toastify";
import { logout_API } from "~/apis";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  console.log("user", user);

  const navigate = useNavigate();

  const dispatch = useDispatch();
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

  const handleLogout = async () => {
    try {
      const response = await logout_API(user.id);
      toast.success(response.message);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <button
        id="acount"
        className={`flex items-center gap-1 px-2 py-1 lg:py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isOpen ? "bg-gray-200" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.avatar ? (
          <img className="w-6 h-6 rounded-full" src={user?.avatar} alt="" />
        ) : (
          <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-blue-500">
            {user?.username.slice(0, 2)}
          </div>
        )}
        <MdOutlineArrowDropDown className="hidden lg:block" size={20} />
      </button>
      <Tooltip anchorSelect="#acount" clickable>
        Acount
      </Tooltip>

      {isOpen && (
        <div className="absolute text-xs md:text-sm top-full right-0 mt-2 bg-gray-700 border border-gray-200 p-4 rounded-md min-w-80 z-10 text-gray-200">
          <h4 className="font-medium uppercase text-[10px] md:text-[13px]">
            Account
          </h4>
          <div className="px-4">
            <div className="flex items-center gap-2 py-1">
              <img
                className="w-10 h-10 rounded-full"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Flifestyle.znews.vn%2Fnhung-hinh-anh-luu-giu-khoanh-khac-dang-nho-cua-doi-nguoi-post860196.html&psig=AOvVaw1zkuh8oY_WL0elD36m6IR6&ust=1734457798229000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPClufzsrIoDFQAAAAAdAAAAABAE"
                alt=""
              />
              <div>
                <h2 className="text-xs md:text-sm">{user.username}</h2>
                <span className="text-[10px] md:text-xs font-light">
                  {user.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-600 p-2">
              <LiaUserCogSolid size={20} /> Manage acount
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-600 p-2 max-w-screen-lg">
              <PiUserSwitchLight size={20} /> Switch acount
            </div>
          </div>
          <hr className="my-4" />
          <div className="px-4">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-600 p-2">
              <IoSettingsOutline size={20} /> Setting
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-600 p-2"
              onClick={handleLogout}
            >
              <IoIosLogOut size={20} /> Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
