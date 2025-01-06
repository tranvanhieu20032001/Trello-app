import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineAddCard } from "react-icons/md";
import { TbTemplate } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import ListCards from "./ListCards/ListCards";
import mapOrder from "~/utils/sort";

function Column({ column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Giảm độ mờ khi kéo
    height: "100%",
  };

  const cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        className="column w-64 overflow-x-hidden px-3 py-3 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2 text-primary dark:text-secondary text-xs md:text-sm"
      >
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-[15px]">{column.title}</h1>
          <BsThreeDots size={20} />
        </div>

        <ListCards cards={cards} />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs cursor-pointer">
            <MdOutlineAddCard size={18} />
            Add a card
          </span>

          <span
            id="newtemplate"
            className="w-6 h-6 flex justify-center items-center rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
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
    </div>
  );
}

export default Column;
