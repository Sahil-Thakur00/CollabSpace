import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '@/constants';

export type SocketSend = (event: string, params: object) => void;

let globalSocket: Socket | null = null;

export const useSocket = (): { send: SocketSend; socket: Socket | null } => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!globalSocket || !globalSocket.connected) {
      globalSocket = io(WS_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });
    }
    socketRef.current = globalSocket;

    return () => {
      // Don't disconnect on component unmount — let board.tsx manage lifecycle
    };
  }, []);

  const send: SocketSend = useCallback((event: string, params: object) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, params);
    }
  }, []);

  return { send, socket: socketRef.current };
};
