import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiLink } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { joinBoard, searchUser } from "~/apis";
import LoaderSearch from "../Loader/LoaderSearch";
import { toast } from "react-toastify";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice";
import { IoIosLogOut } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { AiOutlineDelete } from "react-icons/ai";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import ConfirmAction from "./ConfirmAction";

const InviteMemberToBoard = ({ isOpen, onClose, boardId }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const { board } = useSelector((state) => state.board);
  const members = board?.data?.BoardMembers;
  const user = useSelector((state) => state.auth.user);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const { handleCopyLink } = useBoardActions();
  const { handleRemoveMemberFromBoard, handleLeaveBoard } =
    useBoardActions();
  // console.log("board", board?.data);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  const handleSearch = useCallback(
    debounce(async (value) => {
      if (value.length > 2) {
        try {
          const response = await searchUser(value);
          setUsers(response.data);
        } catch (error) {
          setUsers([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUsers([]);
        setIsLoading(false);
      }
    }, 500),
    [setUsers, setIsLoading]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedUser(null);

    if (value.length > 2) {
      setIsLoading(true);
      handleSearch(value);
    } else {
      setUsers([]);
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setQuery(user.email);
    setUsers([]);
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    dispatch(startLoading());
    try {
      const response = await joinBoard({
        boardId,
        userId: selectedUser.id,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setTimeout(() => {
        onClose();
        dispatch(stopLoading());
      }, 800);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setUsers([]);
      setSelectedUser(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 pt-[10vh]">
      <div
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative text-primary"
        ref={modalRef}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="py-3 flex gap-3 relative">
          <input
            type="text"
            className="w-full py-1 px-2 rounded-sm text-primary text-[15px] outline-none border focus:border-blue-600"
            placeholder="Email address"
            value={query}
            onChange={handleChange}
          />
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded-sm hover:bg-primary text-sm"
            onClick={handleAddMember}
            disabled={!selectedUser}
          >
            Invite
          </button>

          {isLoading ? (
            <LoaderSearch />
          ) : users.length > 0 && !selectedUser ? (
            <ul className="absolute bg-white border rounded-md shadow-md w-full mt-10 z-10">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-100"
                >
                  {user.avatar ? (
                    <img
                      className="w-5 h-5 rounded-full"
                      src={user.avatar}
                      alt="avatar"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-blue-600 rounded-full text-xs flex items-center justify-center text-white">
                      {user.username.slice(0, 2)}
                    </div>
                  )}
                  <h2 className="text-sm">{user.email}</h2>
                </li>
              ))}
            </ul>
          ) : query.length > 2 && !selectedUser ? (
            <p className="absolute bg-white border rounded-md shadow-md w-full mt-10 z-10 p-2">
              No users found.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs gap-4">
          <span>Invite someone to this Board with a link:</span>
          <button
            className="flex items-center px-2 py-1 text-gray-900 bg-gray-300 rounded-sm hover:text-blue-500 text-xs"
            onClick={() => handleCopyLink(boardId)}
          >
            <BiLink size={15} /> Copy link
          </button>
        </div>
        <div className="mt-5">
          <h2>Board members</h2>
          <hr />
          <div className="space-y-3 mt-3 overflow-auto max-h-96">
            {members?.map((member, index) => (
              <div
                key={index}
                className="member-search flex items-center gap-3 relative"
              >
                {member?.user?.avatar ? (
                  <img
                    className="w-7 h-7 rounded-full"
                    src={member?.user?.avatar}
                    alt=""
                  />
                ) : (
                  <div className="min-w-7 h-7 rounded-full flex items-center justify-center text-xs bg-blue-600 text-white">
                    {member?.user?.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-medium flex gap-4 items-center">
                    {member?.user?.username}
                    <span
                      className={`flex text-[10px] gap-1 items-center px-1 rounded-md ${
                        member?.user?.id === board?.data?.ownerId
                          ? "bg-red-200 text-red-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {member?.user?.id === board?.data?.ownerId
                        ? "Admin"
                        : "Member"}
                    </span>
                  </h3>
                  <span className="text-sm">{member?.user?.email}</span>
                </div>
                <div className="details-board flex gap-4 items-center justify-end w-full">
                  {member?.user?.id === user.id ? (
                    <button
                      data-tooltip-id="leave"
                      className="text-sm text-red-500 hover:shadow-sm hover:bg-white p-1 rounded-full flex items-center gap-1"
                      onClick={() => setActiveIndex2(index)}
                    >
                      <IoIosLogOut size={18} />
                      <Tooltip id="leave" place="bottom" clickable>
                        Leave board
                      </Tooltip>
                    </button>
                  ) : member?.user?.id !== board.data.ownerId ? (
                    <button
                      data-tooltip-id="remove"
                      className="text-sm text-red-500 hover:shadow-sm hover:bg-white p-1 rounded-full flex items-center gap-1"
                      onClick={() => setActiveIndex(index)}
                    >
                      <AiOutlineDelete size={18} />
                      <Tooltip id="remove" place="bottom" clickable>
                        Remove member
                      </Tooltip>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}

            <ConfirmAction
              isOpen={activeIndex !== null}
              onClose={() => setActiveIndex(null)}
              onConfirm={() =>
                handleRemoveMemberFromBoard(
                  boardId,
                  board.data.ownerId,
                  members[activeIndex]?.user?.id
                )
              }
              title="Remove Member"
              message={`Are you sure you want to remove <strong>${members[activeIndex]?.user?.username}</strong> from <strong>${board?.data?.title}</strong>?`}
              position="top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2"
            />

            <ConfirmAction
              isOpen={activeIndex2 !== null}
              onClose={() => setActiveIndex2(null)}
              onConfirm={() => {
                handleLeaveBoard(boardId);
                setActiveIndex2(null);
              }}
              title="Leave Board"
              message={`Are you sure you want to leave <strong>${board?.data?.title}</strong>?`}
              position="top-1/2 right-1/2 transform -translate-y-1/2 translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberToBoard;
