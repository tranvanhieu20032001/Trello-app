import { formatUploadTime } from "~/utils/formatters";
import { GoCommentDiscussion } from "react-icons/go";
import { useSelector } from "react-redux";
import { BsDot } from "react-icons/bs";
import { useRef, useState } from "react";
import { addComment_API, deleteComment_API, editComment_API } from "~/apis";
import TinyEditor from "./TinyEditor";

const Comment = ({ card, board }) => {
  const user = useSelector((state) => state.auth.user);
  const comments = card?.comments || [];

  const member = board?.BoardMembers || [];
  const mentionsData = member
    ?.filter((m) => m.user.id !== user?.id)
    .map((m) => ({
      id: m.user.id,
      name: m.user.username,
    }));

  const editorRef = useRef(null);
  const editRef = useRef(null);

  const [isCommenting, setIsCommenting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleSaveComment = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.getContent();
    if (!content) return;

    try {
      await addComment_API(card.id, content);
      setIsCommenting(false);
      editorRef.current.setContent("");
    } catch (error) {
      console.error("Add comment error:", error);
    }
  };

  const handleSaveEdit = async (commentId) => {
    const content = editRef.current.getContent();
    if (!content) return;

    try {
      await editComment_API(commentId, content);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Update comment error:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment_API(commentId);
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  return (
    <div className="space-y-2 relative">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-base flex items-center gap-2">
            <GoCommentDiscussion size={20} />
            Comments
          </span>
        </div>

        <div className="flex gap-2">
          {user?.avatar ? (
            <img
              className="w-7 h-7 rounded-full border"
              src={user?.avatar}
              alt=""
            />
          ) : (
            <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white">
              {user?.username.slice(0, 2).toUpperCase()}
            </div>
          )}

          {!isCommenting ? (
            <div
              className="p-2 w-full rounded-md bg-gray-100 dark:bg-gray-700 text-sm cursor-pointer"
              onClick={() => setIsCommenting(true)}
            >
              Write a comment...
            </div>
          ) : (
            <div className="w-full space-y-2">
              <TinyEditor
                onChangeRef={(ref) => (editorRef.current = ref)}
                mentionsData={mentionsData}
              />
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-sm text-sm"
                  onClick={handleSaveComment}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsCommenting(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-sm text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comments.length > 0 && (
        <div className="space-y-1">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 items-start">
              {comment.user?.avatar ? (
                <img
                  className="w-7 h-7 rounded-full border mt-2"
                  src={comment.user.avatar}
                  alt=""
                />
              ) : (
                <div className="mt-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white">
                  {comment.user?.username?.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="flex-1 p-2 rounded-md">
                <div className="flex items-center gap-1 text-xs">
                  <h1 className="font-semibold">{comment.user?.username}</h1>
                  <BsDot />
                  <span className="text-[10px]">
                    {formatUploadTime(comment.createdAt)}
                  </span>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <TinyEditor
                      onChangeRef={(ref) => (editRef.current = ref)}
                      initialValue={comment.content}
                      mentionsData={mentionsData}
                    />

                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-sm text-sm"
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-sm text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="px-2 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                    {user.id === comment.user.id && (
                      <div className="font-light text-xs flex items-center text-[10px] text-gray-400 mt-1">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                          }}
                        >
                          edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
