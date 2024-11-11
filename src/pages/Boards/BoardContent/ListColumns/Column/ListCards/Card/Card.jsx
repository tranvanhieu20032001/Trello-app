import { BsClockHistory } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { LiaCommentSolid } from "react-icons/lia";
import { PiPaperclipLight } from "react-icons/pi";
import { Tooltip } from "react-tooltip";

function Card({ nonvalue }) {
  if (nonvalue) {
    return (
      <div className="card w-full bg-white rounded-md space-y-1 py-1 shadow-md flex items-center justify-between">
        <h1 className="text-base px-2">Use case 1</h1>
        <span id="editCard" className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 mx-4">
          <CiEdit size={15} />
        </span>
        <Tooltip
          anchorSelect="#editCard"
          clickable
          className="z-10"
          place="bottom-start"
        >Edit card</Tooltip>
      </div>
    );
  }

  return (
    <div className="card w-full bg-white rounded-md space-y-1 pb-2 shadow-md">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwtNnDV5Uiq-xIAOyrEGgUxPA8ch1inPtI8A&s"
        alt=""
        className="w-full h-auto object-cover"
      />
      <h1 className="text-base px-2">Use case 1</h1>
      <span className="text-[10px] inline-flex items-center gap-2 mx-2 px-2 bg-green-500 rounded-sm text-white">
        <BsClockHistory size={12} />
        Nov 05, 2024
      </span>
      <div className="flex items-center justify-around">
        <span className="flex items-center px-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <img
              key={idx}
              className="w-6 h-6 rounded-full border -ml-1"
              src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-cardoon-astronaut-avatar-png-image_13315942.png"
              alt=""
            />
          ))}
          <span className="w-6 h-6 rounded-full border -ml-1 text-xs flex items-center justify-center">
            +6
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs">
          <LiaCommentSolid size={15} />6
        </span>
        <span className="flex items-center gap-1 text-xs">
          <PiPaperclipLight size={15} />8
        </span>
      </div>
    </div>
  );
}

export default Card;
