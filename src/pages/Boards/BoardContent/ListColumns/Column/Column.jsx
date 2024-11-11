import { BsThreeDots } from "react-icons/bs";
import { MdOutlineAddCard } from "react-icons/md";
import { TbTemplate } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import ListCards from "./ListCards/ListCards";

function Column() {
  return (
    <div className="column max-w-72 px-3 py-3 bg-gray-200 rounded-md space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-base">Title column 1</h1>
        <BsThreeDots size={20} />
      </div>
      <ListCards />
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs cursor-pointer">
          <MdOutlineAddCard size={18} />
          Add a card
        </span>
        <span
          id="newtemplate"
          className="w-6 h-6 flex justify-center items-center rounded-sm hover:bg-gray-300 cursor-pointer"
        >
          <TbTemplate size={18} />
        </span>
        <Tooltip
          anchorSelect="#newtemplate"
          clickable
          className="z-10"
          place="bottom"
        >
          Create from template
        </Tooltip>
      </div>
    </div>
  );
}

export default Column;
