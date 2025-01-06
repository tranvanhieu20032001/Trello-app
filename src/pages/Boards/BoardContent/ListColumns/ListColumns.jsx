import { MdOutlinePostAdd } from "react-icons/md";
import Column from "./Column/Column";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map((column) => column._id)} strategy={horizontalListSortingStrategy}>
      <div className="listColumns h-full overflow-y-hidden py-4 flex gap-4 px-4 items-start text-primary w-full overflow-x-auto dark:text-secondary text-xs md:text-base">
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        <button className="min-w-64 bg-gray-100 dark:bg-gray-800 gap-1 rounded-md py-1.5 text-sm shadow-md flex items-center justify-center cursor-pointer">
          <MdOutlinePostAdd size={18} />
          <div>Add another list</div>
        </button>
      </div>
    </SortableContext>
  );
}

export default ListColumns;
