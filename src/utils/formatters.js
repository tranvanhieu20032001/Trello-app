export const generatePlaceholderCard = (column) => {
  return {
    id: `${column.id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column.id,
    Fe_placeholderCard: true,
  };
};
