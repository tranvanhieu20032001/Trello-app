import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ListColumns from "./ListColumns/ListColumns";
import mapOrder from "~/utils/sort";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

function BoardContent({ board }) {
  const [orderColumn, setOrderColumn] = useState([]);

  useEffect(() => {
    const columns = mapOrder(board?.columns, board?.columnOrderIds, "_id");
    setOrderColumn(columns);
  }, [board]);

  const handleDragEnd = (event) => {
    console.log("handleDragEnd", event);
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = orderColumn.findIndex(
        (column) => column._id === active.id
      );
      const newIndex = orderColumn.findIndex(
        (column) => column._id === over.id
      );
      setOrderColumn(arrayMove(orderColumn, oldIndex, newIndex));
    }
  };


  const mouse = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touch = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouse, touch);
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div
        className="text-primary dark:text-secondary text-xs md:text-base overflow-x-auto [&::-webkit-scrollbar]:h-3
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-500
        dark:[&::-webkit-scrollbar-thumb]:bg-secondary"
      >
        <ListColumns columns={orderColumn} />
      </div>
    </DndContext>
  );
}

export default BoardContent;
