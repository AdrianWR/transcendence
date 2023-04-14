import { FC, PropsWithChildren, createContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';

export type IChat = {
  id: number;
  name: string;
  avatar: string | null;
};

export type IChatContext = {
  socketRef: React.MutableRefObject<Socket | null>;
  messages: string[];
  sendMessage: (message: string) => void;
};

export const ChatContext = createContext<IChatContext | null>(null);

export const ChatContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [rooms, setRooms] = useState<IChat[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || socketRef.current) return;

    const chatSocketUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;
    const socket = io(chatSocketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        user: user,
      },
    });

    socketRef.current = socket;
  }, [user]);

  const sendMessage = (message: string) => {
    socketRef.current?.emit('message', message);
  };

  useEffect(() => {
    socketRef.current?.on('message', (message: string) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  return (
    <ChatContext.Provider value={{ socketRef, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
