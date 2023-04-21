import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';
import { useSocket } from '../hooks/socket';
import { IUser } from './AuthContext';

export type IMessage = {
  id: number;
  content: string;
  sender: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IChat = {
  id: number;
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
  chats: IChat[];
  messages: IMessage[];
};

export const ChatContext = createContext<IChatContext | null>(null);

export const ChatContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeChat, setChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<IChat[]>([]);
  const { socket } = useSocket();

  const setActiveChat = (chat: IChat | null) => {
    socket?.emit('join', chat?.id);
    setChat(chat);
    console.log('activeChat: ', chat);
  };

  useEffect(() => {
    socket?.on('listChats', (chats: IChat[]) => {
      setChats(chats);
      setActiveChat(chats[0]);
    });

    socket?.on('newMessage', (message: IMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    socket?.on('listMessages', (messages: IMessage[]) => {
      setMessages(messages);
    });
  }, [socket]);

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat, chats, messages }}>
      {children}
    </ChatContext.Provider>
  );
};
