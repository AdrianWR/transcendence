import { Container, Flex, ScrollArea, Text } from '@mantine/core';
import { FC, useEffect, useRef } from 'react';
import { IMessage } from '../../../context/ChatContext';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import MessageInput from './MessageInput';
import styles from './Messages.module.css';

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
  const viewport = useRef<HTMLDivElement>(null);

  const { activeChat, setActiveChat, messages } = useChatContext();
  const { socket } = useSocket();

  const scrollToBottom = () => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'auto' });
    }
  };

  useEffect(() => {
    // Auto scroll to bottom
    scrollToBottom();
  });

  return (
    <Container
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <ScrollArea
        h={300}
        type='always'
        offsetScrollbars={true}
        scrollbarSize={16}
        viewportRef={viewport}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
      </ScrollArea>
      <MessageInput />
    </Container>
  );
};

export default Messages;
