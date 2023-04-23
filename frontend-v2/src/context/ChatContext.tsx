import { FC, PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { alert, success } from '../components/Notifications';
import { useSocket } from '../hooks/socket';
import { IUser } from './AuthContext';

export type IChatType = 'direct' | 'public' | 'private' | 'protected';

export type IRole = 'owner' | 'admin' | 'member';

export type IStatus = 'active' | 'muted' | 'banned';

export type IChatUser = {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  role: IRole;
  status: IStatus;
  username: string;
  avatar: string;
};

export type ICreateChatDto = {
  name: string;
  type: IChatType;
  password?: string;
};

export type IMessage = {
  id: number;
  content: string;
  chat: IChat;
  sender: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IChat = {
  id: number;
  name: string;
  type: IChatType;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  avatar?: string;
  users: IChatUser[];
};

export type IChatContext = {
  activeChat: IChat | null;
  setActiveChat: (chat: IChat | null) => void;
  createDirectMessage(friendId: number): void;
  createGroupChat(createChatDto: ICreateChatDto): void;
  isBlocked: boolean;
  setIsBlocked: (isBlocked: boolean) => void;
  chats: IChat[];
  messages: IMessage[];
};

export const ChatContext = createContext<IChatContext | null>(null);

export const ChatContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<IChat[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    socket?.emit('listChats');

    socket?.on('listChats', (chats: IChat[]) => {
      setChats(chats);
      setActiveChat(chats[0]);
    });

    socket?.on('updateChats', () => {
      socket?.emit('listChats');
    });

    socket?.on('apiError', (message: string) => {
      alert(message, 'Chat');
    });

    socket?.on('apiSuccess', (message: string) => {
      success(message, 'Chat');
    });

    return () => {
      socket?.off('listChats');
      socket?.off('updateChats');
      socket?.off('apiError');
    };
  }, [socket]);

  const createDirectMessage = useCallback(
    (friendId: number) => {
      socket?.emit('createDirectMessage', friendId);
    },
    [socket],
  );

  useEffect(() => {
    if (activeChat) {
      socket?.emit('listMessages', activeChat.id);
    }

    if (activeChat?.type === 'protected') {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }

    socket?.on('listMessages', (messages: IMessage[]) => {
      if (!messages.length) {
        setMessages([]);
      } else if (activeChat?.id === messages[0]?.chat.id) {
        setMessages(messages);
      }
    });

    socket?.on('newMessage', (message: IMessage) => {
      if (activeChat?.id === message.chat.id) {
        setMessages((messages) => [...messages, message]);
      }
    });

    return () => {
      socket?.off('listMessages');
      socket?.off('newMessage');
    };
  }, [socket, activeChat]);

  const createGroupChat = useCallback(
    async (createChatDto: ICreateChatDto) => {
      socket?.emit('createChat', createChatDto);
    },
    [socket],
  );

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        setActiveChat,
        chats,
        messages,
        createDirectMessage,
        createGroupChat,
        isBlocked,
        setIsBlocked,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
