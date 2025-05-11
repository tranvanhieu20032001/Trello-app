import React, { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import Visibility from "./Visibility";
import { useParams } from "react-router-dom";
import { useBoardActions } from "~/utils/hooks/useBoardActions";

const Starred = ({ data }) => {
  const { boardId } = useParams();

  const { handleToggleStarred } = useBoardActions();

  const userPref = data?.UserBoardPreference?.[0];
  const [starred, setStarred] = useState(userPref?.starred || false);

  return (
    <>
      <span
        id="star"
        className="p-2 hover:bg-gray-600 rounded-md"
        onClick={() => {handleToggleStarred(boardId); setStarred((prev) => !prev)}}
      >
        {!starred ? (
          <FaRegStar className="hover:text-yellow-500" size={20} />
        ) : (
          <FaStar size={20} color="#eab308" />
        )}
      </span>
      <Tooltip
        anchorSelect="#star"
        clickable
        className="z-10"
        place="bottom-start"
      >
        Click to star or unstar this board. Starred boards show up at the top of
        your boards list.
      </Tooltip>
      <Visibility />
    </>
  );
};

export default Starred;
