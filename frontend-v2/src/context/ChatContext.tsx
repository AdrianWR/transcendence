import { FC, PropsWithChildren, createContext, useState } from 'react';
import { useSocket } from '../hooks/socket';

export type IChat = {
  id: string;
  name: string;
  type: 'public' | 'private' | 'protected by password';
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  avatar?: string;
};

export type IChatContext = {
  activeChat: IChat | null;
  setActiveChat: (chat: IChat | null) => void;
};

export const ChatContext = createContext<IChatContext | null>(null);

export const ChatContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [activeChat, setChat] = useState<IChat | null>(null);
  const [rooms, setRooms] = useState<IChat[]>([]);
  const { socket } = useSocket();

  const setActiveChat = (chat: IChat | null) => {
    socket.emit('joinRoom', chat?.id);
    setChat(chat);
  };

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat }}>{children}</ChatContext.Provider>
  );
};
