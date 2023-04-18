import { Container, Flex, Text } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { IUser } from '../../context/AuthContext';
import { useSocket } from '../../hooks/socket';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import MessageInput from './MessageInput';
import styles from './Messages.module.css';

export type IMessage = {
  id: number;
  content: string;
  sender: IUser;
  createdAt: string;
  updatedAt: string;
};

// Write for me a MessageItem component, which takes an IMessage object and renders it
// as a div with a p tag inside it, which contains the message content. The style of this component should
// simulate a chat bubble, with the sender name on top and the message content below it.
// The message bubble should be on the left if the sender is the current user, and on the right if the sender is the other user.
// The message bubble should have a different background color depending on the sender.
const MessageItem: FC<IMessage> = ({ content, sender, updatedAt }) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === sender.id;

  return (
    <div>
      <Flex align={isCurrentUser ? 'flex-end' : 'flex-start'} className={styles['chat-message']}>
        <Text className={styles['chat-message-sender']}>{sender.username}</Text>
        <Text className={styles['chat-message-content']}>{content}</Text>
        <Text className={styles['chat-message-timestamp']}>
          {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Flex>
    </div>
  );
};

// Defines a message component that fetches the message from the server
// and renders it.
const Messages: FC = () => {
  const mockedMessages: IMessage[] = [
    {
      id: 1,
      content: 'Hello',
      sender: {
        id: 9,
        username: 'user1',
        email: 'user1@email.com',
        firstName: 'User',
        lastName: 'One',
        mfaEnabled: false,
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
      },
      createdAt: '2021-08-01T12:00:00.000Z',
      updatedAt: '2021-08-01T12:00:00.000Z',
    },
    {
      id: 2,
      content: 'Hi',
      sender: {
        id: 2,
        username: 'user2',
        email: 'user2@email.com',
        firstName: 'User',
        lastName: 'Two',
        mfaEnabled: false,
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
      },
      createdAt: '2021-08-01T12:00:00.000Z',
      updatedAt: '2021-08-01T12:00:00.000Z',
    },
  ];

  const [messages, setMessages] = useState<IMessage[]>(mockedMessages);
  const { activeChat, setActiveChat } = useChatContext();
  const { socket } = useSocket();

  useEffect(() => {
    // Get active chat messages
    socket.on('listMessages', (messages: IMessage[]) => setMessages(messages));
  }, []);

  return (
    <Container
      style={{
        // height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} {...message} />
      ))}

      <MessageInput />
    </Container>
  );
};

export default Messages;
