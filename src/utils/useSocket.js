import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { BE_URL } from './constants';

const socket = io(BE_URL);

const useSocket = (workspaceId) => {
  useEffect(() => {
    if (!workspaceId) return;

    socket.emit('join_workspace', { workspaceId });

    socket.on('workspace_notification', (data) => {
      toast.info(data.message);
    });

    return () => {
      socket.emit('leave_workspace', { workspaceId });
      socket.off('workspace_notification');
    };
  }, [workspaceId]);

  return socket;
};

export default useSocket;
