import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ListColumns from "./ListColumns/ListColumns";
import mapOrder from "~/utils/sort";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import socket from "~/utils/socket";
import { fetchBoardById } from "~/store/slices/boardSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ACTIVE_ITEM_TYPE = {
  COLOMN: "ACTIVE_COLUMN",
  CARD: "ACTIVE_CARD",
};

function BoardContent({ board }) {
  const dispatch = useDispatch();
  const [orderColumn, setOrderColumn] = useState([]);
  const [boardHeight, setBoardHeight] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [activeItemType, setActiveItemType] = useState(null);
  const [activeItemData, setActiveItemData] = useState(null);
  const [oldColumn, setOldColumn] = useState(null);
  const {
    handleMoveColumn,
    handleMoveCardInColumnn,
    handleMoveCardToDifferentColumnn,
  } = useBoardActions();

  useEffect(() => {
    const columns = mapOrder(board?.columns, board?.columnOrderIds, "id");
    setOrderColumn(columns);
    const navbarHeight = document.getElementById("navbar")?.offsetHeight || 0;
    const boardbarHeight =
      document.getElementById("boardbar")?.offsetHeight || 0;
    const totalHeight = window.innerHeight - navbarHeight - boardbarHeight;
    setBoardHeight(totalHeight);
  }, [board]);

  const updateHandler = () => {
    dispatch(fetchBoardById(board.id));
  };

  useEffect(() => {
    if (!board?.id) return;
    const handleMemberEvent = (username, reason) => {
      let message = `${username} has been updated.`;
      if (reason === "new-member") {
        message = `${username} has been added to the board!`;
      } else if (reason === "remove-member") {
        message = `${username} has been removed from the board.`;
      } else if (reason === "leave-member") {
        message = `${username} has left the board.`;
      }
      toast.success(message);
      dispatch(fetchBoardById(board.id));
    };

    socket.emit("joinBoard", board.id);
    socket.on("updateColumnOrder", updateHandler);
    socket.on("notify", updateHandler);
    socket.on("new-member", (username) =>
      handleMemberEvent(username, "new-member")
    );
    socket.on("remove-member", (username) =>
      handleMemberEvent(username, "remove-member")
    );
    socket.on("leave-member", (username) =>
      handleMemberEvent(username, "leave-member")
    );

    return () => {
      socket.off("updateColumnOrder", updateHandler);
      socket.off("notify", updateHandler);
      socket.off("new-member");
      socket.off("remove-member");
      socket.off("leave-member");
    };
  }, [board?.id, dispatch]);

  useEffect(() => {
    if (!board?.id) return;
    socket.emit("joinColumn", board);
    socket.on("updateOrderCardIds", updateHandler);
    return () => {
      socket.off("updateOrderCardIds", updateHandler);
    };
  }, [board?.id]);

  const handleSetCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeCardId,
    activeCardata,
    trigger
  ) => {
    setOrderColumn((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card.id === overCardId
      );
      // console.log("orderCardIndex", overCardIndex);

      // Xử lý kéo đến vị trí mới code mẫu
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column.id === activeColumn.id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column.id === overColumn.id
      );
      if (nextActiveColumn) {
        //Xoa card o cai column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card.id !== activeCardId
        );
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        //cap nhat lai mang cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card.id
        );
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card.id !== activeCardId
        );
        // phai cap nhat lai du lieu chuan columnId sau khi keo tha giua 2 column khac nhau
        const rebuild_activeCardata = {
          ...activeCardata,
          columnId: nextOverColumn.id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeCardata
        );

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.Fe_placeholderCard
        );

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card.id
        );
      }
      if (trigger === "handleDragEnd") {
        handleMoveCardToDifferentColumnn(
          activeCardId,
          oldColumn?.id,
          nextOverColumn?.id,
          nextColumns
        );
      }

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    setActiveId(null);
    setActiveItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_ITEM_TYPE.CARD
        : ACTIVE_ITEM_TYPE.COLOMN
    );
    setActiveItemData(event?.active?.data?.current);

    //Neu keo card thi moi thuc hien hanh dong set gia tri oldcolumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumn(checkColumnByCardId(event?.active?.id));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    //Xu ly keo tha card
    if (activeItemType === ACTIVE_ITEM_TYPE.CARD) {
      const {
        id: activeCardId,
        data: { current: activeCardata },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = checkColumnByCardId(activeCardId);
      const overColumn = checkColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      // console.log("oldColumn", oldColumn);
      // console.log("over", overColumn);
      if (oldColumn.id !== overColumn.id) {
        handleSetCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeCardId,
          activeCardata,
          "handleDragEnd"
        );
      } else {
        const oldIndex = oldColumn?.cards?.findIndex(
          (card) => card.id === activeCardId
        );
        const newIndex = overColumn?.cards?.findIndex(
          (card) => card.id === over.id
        );

        const dndOrderedCard = arrayMove(oldColumn?.cards, oldIndex, newIndex);
        // console.log("dndOrderedCard", dndOrderedCard);
        const dndOrderedCardIds = dndOrderedCard.map((card) => card.id);
        setOrderColumn((preColumn) => {
          const nextColumns = cloneDeep(preColumn);

          const targetColumn = nextColumns.find(
            (column) => column.id === overColumn.id
          );
          targetColumn.cards = dndOrderedCard;
          targetColumn.cardOrderIds = dndOrderedCardIds;
          return nextColumns;
        });

        handleMoveCardInColumnn(oldColumn?.id, dndOrderedCardIds);
        console.log("dndOrderedCardIds", dndOrderedCardIds);
      }
    }

    //Xu ly keo tha column
    if (activeItemType === ACTIVE_ITEM_TYPE.COLOMN) {
      if (active.id !== over.id) {
        const oldIndex = orderColumn.findIndex(
          (column) => column.id === active.id
        );
        const newIndex = orderColumn.findIndex(
          (column) => column.id === over.id
        );

        handleMoveColumn(board.id, arrayMove(orderColumn, oldIndex, newIndex));
        setOrderColumn(arrayMove(orderColumn, oldIndex, newIndex));
      }
    }

    setActiveId(null);
    setActiveItemType(null);
    setActiveItemData(null);
    setOldColumn(null);
  };

  // Sử lý trong quá trình kéo phần tử
  const handleDragOver = (event) => {
    if (activeItemType === ACTIVE_ITEM_TYPE.COLOMN) return;
    // console.log("Handle Drag Over", event);

    const { active, over } = event;
    if (!active || !over) return;
    const {
      id: activeCardId,
      data: { current: activeCardata },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = checkColumnByCardId(activeCardId);
    const overColumn = checkColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      handleSetCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeCardId,
        activeCardata,
        "handleDragOver"
      );
    }
  };

  const checkColumnByCardId = (cardId) => {
    return orderColumn.find((column) =>
      column.cards.map((card) => card.id)?.includes(cardId)
    );
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  const mouse = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touch = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouse, touch);

  return (
    <DndContext
      onDragStart={handleDragStart}
      collisionDetection={closestCorners} // Thuat toan phat hien va cham
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
    >
      <div className="overflow-y-hidden" style={{ height: boardHeight }}>
        <ListColumns columns={orderColumn} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {activeItemType === ACTIVE_ITEM_TYPE.COLOMN ? (
            <Column column={activeItemData} />
          ) : (
            <Card card={activeItemData} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default BoardContent;
