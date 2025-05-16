import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { addMemberToCard_API, deleteMemberToCard_API } from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";

const MemberCardModal = ({
  card,
  board,
  onClose,
  position = "top-0 left-full",
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const boardMember = board?.BoardMembers || [];
  const cardMember = card?.CardMembers || [];

  const cardMemberIds = cardMember.map((member) => member.userId);

  const filteredBoardMembers = boardMember.filter(
    (member) => !cardMemberIds.includes(member.userId)
  );

  const searchedBoardMembers = filteredBoardMembers.filter((member) =>
    member.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMemberToCard = async (memberId) => {
    await addMemberToCard_API(card?.id, memberId);
    dispatch(fetchBoardById(board?.id));
  };

  const handldDeleteMemberToCard = async (memberId) => {
    console.log("memberId", memberId);

    await deleteMemberToCard_API(card?.id, memberId);
    dispatch(fetchBoardById(board?.id));
  };

  return (
    <div
      className={`absolute ${position} bg-white px-6 py-4 rounded-2xl border shadow-lg w-96 z-50`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-center font-medium text-lg flex-grow text-gray-800">
          Members
        </h1>
        <button className="text-gray-600 hover:text-red-500" onClick={onClose}>
          <LiaTimesSolid size={20} />
        </button>
      </div>
      <div>
        <h1 className="font-bold mb-2">Card members</h1>
        {cardMember.length > 0 ? (
          <div className="space-y-2">
            {cardMember.map((member) => (
              <div
                key={member?.id}
                className="flex gap-2 items-center hover:bg-gray-200 px-3 py-1 rounded-md relative"
              >
                {member?.user?.avatar ? (
                  <img
                    className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border"
                    src={member.user.avatar}
                    alt=""
                  />
                ) : (
                  <span className="flex items-center justify-center capitalize bg-primary text-white text-sm w-6 h-6 lg:w-7 lg:h-7 rounded-full border">
                    {member.user.username?.slice(0, 2)}
                  </span>
                )}
                <div>
                  <h1 className="text-sm font-medium">
                    {member?.user?.username}
                  </h1>
                  <h2 className="text-xs text-gray-600">
                    {member?.user?.email}
                  </h2>
                </div>
                <button
                  className="absolute right-2 text-gray-600 hover:text-red-500"
                  onClick={() => handldDeleteMemberToCard(member?.user?.id)}
                >
                  <LiaTimesSolid size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">No members found</p>
        )}
      </div>

      <div className="mt-6">
        <h1 className="font-bold mb-2">Board members</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members..."
          className="py-1.5 px-3 rounded-lg outline-none text-sm text-gray-800 border border-gray-300 focus:border-blue-500 transition w-full"
        />

        <div className="space-y-2 max-h-60 overflow-y-auto mt-2">
          {searchedBoardMembers.length > 0 ? (
            searchedBoardMembers.map((member) => (
              <div
                key={member?.userId}
                className="flex gap-2 items-center hover:bg-gray-200 px-3 py-1 rounded-md"
                onClick={() => handleAddMemberToCard(member?.userId)}
              >
                {member?.user?.avatar ? (
                  <img
                    className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border"
                    src={member.user.avatar}
                    alt=""
                  />
                ) : (
                  <span className="flex items-center justify-center capitalize bg-primary text-white text-sm w-6 h-6 lg:w-7 lg:h-7 rounded-full border">
                    {member.user.username?.slice(0, 2)}
                  </span>
                )}
                <div>
                  <h1 className="text-sm font-medium">
                    {member?.user?.username}
                  </h1>
                  <h2 className="text-xs text-gray-600">
                    {member?.user?.email}
                  </h2>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">No members found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCardModal;
