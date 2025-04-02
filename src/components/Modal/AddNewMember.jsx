import { useState, useEffect, useCallback } from "react";
import { BiLink } from "react-icons/bi";
import { toast } from "react-toastify";
import { joinWorkspace, searchUser } from "~/apis";
import { debounce } from "lodash";
import LoaderSearch from "~/components/Loader/LoaderSearch";
import { useWorkspaceActions } from "~/utils/hooks/useWorkspaceActions";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";
import { useDispatch } from "react-redux";

const AddNewMember = ({ isOpen, onClose, workspaceId }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { handleCopyLink } = useWorkspaceActions();

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setUsers([]);
      setSelectedUser(null);
    }
  }, [isOpen]);
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
    try {
      const response = await joinWorkspace({
        workspaceId,
        userId: selectedUser.id,
      });
      dispatch(fetchWorkspaceData(workspaceId));
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="py-3 flex gap-3 relative">
          <input
            type="text"
            className="w-full py-1 px-2 rounded-sm text-primary text-[15px] border focus:outline-[0.5px] focus:outline-blue-600"
            placeholder="Email address"
            value={query}
            onChange={handleChange}
          />
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded-sm hover:bg-primary text-sm"
            onClick={handleAddMember}
            disabled={!selectedUser}
          >
            Add
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
          <span>Invite someone to this Workspace with a link:</span>
          <button
            className="flex items-center px-2 py-1 text-gray-900 bg-gray-300 rounded-sm hover:text-blue-500 text-xs"
            onClick={() => handleCopyLink(workspaceId)}
          >
            <BiLink size={15} /> Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMember;
