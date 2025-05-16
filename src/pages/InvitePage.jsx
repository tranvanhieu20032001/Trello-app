import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { joinWorkspace, joinBoard, verifyInviteLink } from "~/apis";
import home from "~/assets/home.svg";

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [workspaceId, setWorkspaceId] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyInvite = async () => {
      try {
        const response = await verifyInviteLink(token);
        if (response.data.workspaceId) setWorkspaceId(response.data.workspaceId);
        if (response.data.boardId) setBoardId(response.data.boardId);
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
        toast.error(
          error.response?.data?.message || "Invalid or expired invite link"
        );
      }
    };
    verifyInvite();
  }, [token]);

  const handleJoin = async () => {
    try {
      if (workspaceId) {
        await joinWorkspace({ workspaceId, userId });
        navigate(`/workspace/${workspaceId}/members`);
      } else if (boardId) {
        await joinBoard({ boardId, userId });
        navigate(`/board/${boardId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join.");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="w-full mx-4 my-8 border rounded-lg text-primary">
        <img className="w-full" src={home} alt="" />
        {isValid ? (
          <h1 className="text-base text-center my-3">
            You have been invited to a {workspaceId ? "workspace" : "board"}!{" "}
            <button
              className="px-2 text-blue-600 hover:text-primary"
              onClick={handleJoin}
            >
              Join Now
            </button>
          </h1>
        ) : (
          <h1 className="text-base text-red-500 text-center my-3">
            This invite link is invalid or expired.
          </h1>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
