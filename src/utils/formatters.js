import { format } from "date-fns";

export const generatePlaceholderCard = (column) => {
  return {
    id: `${column.id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column.id,
    Fe_placeholderCard: true,
  };
};

export const formatUploadTime = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  const diffInMin = diffInMs / 1000 / 60;

  if (diffInMin < 1) return "just now";
  if (diffInMin < 60) return `${Math.floor(diffInMin)} min ago`;
  const diffInHour = diffInMin / 60;
  if (diffInHour < 24) return `${Math.floor(diffInHour)}h ago`;
  const diffInDay = diffInHour / 24;
  if (diffInDay < 3)
    return `${Math.floor(diffInDay)} day${
      Math.floor(diffInDay) > 1 ? "s" : ""
    } ago`;

  return format(created, "dd/MM/yyyy HH:mm");
};

