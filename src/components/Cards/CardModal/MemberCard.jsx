import React from "react";
import { Tooltip } from "react-tooltip";

const MemberCard = ({ card }) => {
  const members = card?.CardMembers || [];
  const moreId = `more-${card?.id}`;

  return (
    <>
      {members.length ? (
        <div className="flex items-center gap-3">
          <span>Members:</span>
          <div className="flex items-center gap-2 mt-2">
            {members.slice(0, 5).map((member, index) => {
              const tooltipId = `img-${card?.id}-${index}`;
              return (
                <div key={member.user.id} className="relative -ml-[3px] lg:-ml-[5px]">
                  {member?.user?.avatar ? (
                    <img
                      data-tooltip-id={tooltipId}
                      className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border"
                      src={member.user.avatar}
                      alt=""
                    />
                  ) : (
                    <span
                      data-tooltip-id={tooltipId}
                      className="flex items-center justify-center capitalize bg-primary text-white text-sm w-6 h-6 lg:w-7 lg:h-7 rounded-full border"
                    >
                      {member.user.username?.slice(0, 2)}
                    </span>
                  )}
                  <Tooltip id={tooltipId} clickable className="z-10" place="bottom">
                    {member.user.username}
                  </Tooltip>
                </div>
              );
            })}

            {members.length > 5 && (
              <div className="relative -ml-[3px] lg:-ml-[5px]">
                <span
                  id={moreId}
                  className="flex justify-center items-center w-6 h-6 lg:w-7 lg:h-7 rounded-full border bg-gray-400 cursor-pointer text-white text-xs"
                >
                  +{members.length - 5}
                </span>
                <Tooltip anchorSelect={`#${moreId}`} clickable className="z-10" place="bottom">
                  {members.slice(5).map((member) => (
                    <div key={member.user.id} className="flex items-center gap-1 mb-3">
                      {member?.user?.avatar ? (
                        <img
                          className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border"
                          src={member.user.avatar}
                          alt=""
                        />
                      ) : (
                        <span className="flex items-center justify-center capitalize bg-primary text-white text-xs w-5 h-5 lg:w-6 lg:h-6 rounded-full border">
                          {member.user.username?.slice(0, 2)}
                        </span>
                      )}
                      {member.user.username}
                    </div>
                  ))}
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MemberCard;
