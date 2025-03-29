import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { BE_URL } from "./constants";

const useSocket = (workspaceData, userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!workspaceData?.id || !userId) return;

    console.log("Connecting to WebSocket...");

    const newSocket = io(BE_URL, {
      autoConnect: true, // 🔥 Fix: Chỉ connect khi cần
      query: { userId }, // 🔥 Fix: Gửi userId để server nhận diện
    });

    setSocket(newSocket);

    newSocket.emit("join_workspace", { userId, workspaceId: workspaceData.id });

    newSocket.on("workspace_notification", (data) => {
      console.log("WebSocket message received:", data);
      toast.info(data.message);
    });

    return () => {
      console.log("Disconnecting from WebSocket...");
      newSocket.emit("leave_workspace", { userId, workspaceId: workspaceData.id });
      newSocket.off("workspace_notification");
      newSocket.disconnect();
    };
  }, [workspaceData?.id, userId]);

  return socket;
};

export default useSocket;
