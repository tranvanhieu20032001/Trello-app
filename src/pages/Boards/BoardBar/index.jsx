import { BsBookmarkStarFill } from "react-icons/bs";
import { FaGoogleDrive, FaRegStar } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdFilterList, MdOutlinePublic } from "react-icons/md";
import { Tooltip } from "react-tooltip";

function BoardBar() {
  return (
    <div className="text-primary dark:text-secondary px-4 py-2 flex justify-between text-xs md:text-base flex-col lg:flex-row">
      <div className="flex items-center gap-1 justify-between lg:justify-start">
        <h1 className="font-semibold p-2 hover:bg-gray-200">WorkSpace Name</h1>
        <span id="star" className="p-2 hover:bg-gray-200">
          <FaRegStar size={20} />
        </span>
        <Tooltip
          anchorSelect="#star"
          clickable
          className="z-10"
          place="bottom-start"
        >
          Click to star or unstar this board. Starred boards show up at the top
          of your boards list.
        </Tooltip>
        <span
          id="visibility"
          className="p-2 hover:bg-gray-200 flex items-center gap-1"
        >
          <MdOutlinePublic size={20} />{" "}
          <span className="hidden lg:inline-block">Public</span>
        </span>
        <Tooltip
          anchorSelect="#visibility"
          clickable
          className="z-10"
          place="bottom"
        >
          Change visibility
        </Tooltip>
        <span
          id="gg-driver"
          className="p-2 hover:bg-gray-200 flex items-center gap-1"
        >
          <FaGoogleDrive size={20} />{" "}
          <span className="hidden lg:inline-block">Add to Google Driver</span>
        </span>
        <Tooltip
          anchorSelect="#gg-driver"
          clickable
          className="z-10"
          place="bottom"
        >
          Add to Google Driver
        </Tooltip>
        <span
          id="automation"
          className="p-2 hover:bg-gray-200 flex items-center gap-1"
        >
          <IoIosFlash size={20} />{" "}
          <span className="hidden lg:inline-block">Automation</span>
        </span>
        <Tooltip
          anchorSelect="#automation"
          clickable
          className="z-10"
          place="bottom"
        >
          Automation
        </Tooltip>

        <span
          id="filter"
          className="p-2 hover:bg-gray-200 flex items-center gap-1"
        >
          <MdFilterList size={20} />
          <span className="hidden lg:inline-block">Filter</span>
        </span>
        <Tooltip
          anchorSelect="#filter"
          className="z-10"
          place="bottom"
        >
          Filter <span className="px-2 py-1 bg-slate-600">F</span>
        </Tooltip>
      </div>
      <hr className="my-2 block lg:hidden" />
      <div className="flex justify-end">
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
          <span className="absolute bottom-0 right-0" id="admin">
            <BsBookmarkStarFill />
          </span>
          <Tooltip
            anchorSelect="#admin"
            clickable
            className="z-10"
            place="bottom"
          >
            This member is an admin of this board
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
          <span className="absolute bottom-0 right-0" id="admin">
            <BsBookmarkStarFill />
          </span>
          <Tooltip
            anchorSelect="#admin"
            clickable
            className="z-10"
            place="bottom"
          >
            This member is an admin of this board
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <img
            id="hieu"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border"
            src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cartoon-astronaut-avatar-png-image_13315942.png"
            alt=""
          />
          <Tooltip
            anchorSelect="#hieu"
            clickable
            className="z-10"
            place="bottom"
          >
            Hieu
          </Tooltip>
        </div>
        <div className="relative -ml-[3px] lg:-ml-[5px]">
          <span
            id="more"
            className="flex justify-center items-center w-6 h-6 lg:w-8 lg:h-8 rounded-full border bg-gray-200"
          >
            +6
          </span>
          <Tooltip
            anchorSelect="#more"
            clickable
            className="z-10"
            place="bottom"
          >
            More
          </Tooltip>
        </div>
        <span
          id="invite"
          className="ml-6 py-1 px-2 lg:py-2 lg:px-3 rounded-md bg-primary dark:bg-secondary text-white flex items-center gap-1"
        >
          <IoPersonAddOutline size={12} /> Invite
        </span>
        <Tooltip
          anchorSelect="#invite"
          clickable
          className="z-10"
          place="bottom"
        >
          Invite
        </Tooltip>
      </div>
    </div>
  );
}

export default BoardBar;
