import React from "react";
import { BsActivity } from "react-icons/bs";
import { formatUploadTime } from "~/utils/formatters";
import { generateActivityMessage } from "~/utils/hooks/generateActivityMessage";

const Activity = ({ card }) => {
  const activity = card?.Activity.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-base flex items-center gap-2">
          <BsActivity size={20} />
          Activity
        </span>
      </div>
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {activity?.map((ac, index) => (
          <div key={index} className="flex gap-2">
            {ac.user?.avatar ? (
              <img
                className="w-7 h-7 rounded-full border"
                src={ac.user?.avatar}
                alt=""
              />
            ) : (
              <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs bg-blue-600 text-white">
                {ac.user?.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xs">
                <span className="font-semibold">{ac.user?.username}</span>{" "}
                {generateActivityMessage(ac.action, ac.data)}
              </h1>
              <span className="text-[10px]">
                {formatUploadTime(ac?.createAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
