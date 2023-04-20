import { FC, PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { alert, success } from '../components/Notifications';
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
  type: 'public' | 'private' | 'protected by password' | 'direct';
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  avatar?: string;
  users: IUser[];
};

export type IChatContext = {
  activeChat: IChat | null;
  setActiveChat: (chat: IChat | null) => void;
  createDirectMessage(friendId: number): void;
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
    if (chat) socket?.emit('join', chat?.id);
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

    socket?.on('apiError', (message: string) => {
      alert(message, 'Chat');
    });

    socket?.on('apiSuccess', (message: string) => {
      success(message, 'Chat');
    });
  }, [socket]);

  const createDirectMessage = useCallback(
    (friendId: number) => {
      socket?.emit('createDirectMessage', friendId);
    },
    [socket],
  );

  return (
    <ChatContext.Provider
      value={{ activeChat, setActiveChat, chats, messages, createDirectMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};
