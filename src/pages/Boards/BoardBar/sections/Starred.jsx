import React, { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import Visibility from "./Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toggleStarred_API } from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";

const Starred = ({ data }) => {
  const user = useSelector((state) => state.auth.user);
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const userPref = data?.UserBoardPreference?.find(
    (pref) => pref.userId === user?.id
  );

  const [starred, setStarred] = useState(userPref?.starred || false);

  const handleToggleStarred = async () => {
    try {
      await toggleStarred_API(boardId);
      setStarred((prev) => !prev);
      dispatch(fetchBoardById(boardId));
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <>
      <span
        id="star"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        onClick={handleToggleStarred}
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
