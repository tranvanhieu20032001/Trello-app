import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWorkspaceByUser_API } from "~/apis";

function Workspace() {
  const [isOpen, setIsOpen] = useState(false);
  const [yourWorkspaces, setYourWorkspaces] = useState([]);
  const [guestWorkspaces, setGuestWorkspaces] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
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

    if (isOpen) fetchData();
  }, [isOpen, user?.id]);

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

  const renderWorkspaceItem = (ws) => (
    <li
      key={ws.id}
      className="py-2 px-4 hover:bg-gray-600 rounded-md flex items-center gap-4 cursor-pointer"
      onClick={() => navigate(`/workspace/${ws.id}`)}
    >
      <span className="w-9 h-9 rounded-sm flex justify-center items-center bg-blue-300 uppercase font-semibold">
        {ws.name.charAt(0)}
      </span>
      {ws.name}
    </li>
  );

  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isOpen ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Workspace <MdOutlineArrowDropDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-60 lg:min-w-80 z-10 text-primary dark:text-secondary">
          <h4 className="text-[12px] px-4 py-2 font-medium">Your Workspaces</h4>
          <ul>
            {yourWorkspaces.length > 0 ? (
              yourWorkspaces.map(renderWorkspaceItem)
            ) : (
              <li className="text-sm px-4 py-2 text-gray-500">
                No workspaces found
              </li>
            )}
          </ul>

          {guestWorkspaces.length > 0 && (
            <>
              <hr className="border-gray-200 my-2" />
              <h4 className="text-[12px] px-4 py-2 font-medium">
                Guest Workspaces
              </h4>
              <ul>{guestWorkspaces.map(renderWorkspaceItem)}</ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Workspace;
