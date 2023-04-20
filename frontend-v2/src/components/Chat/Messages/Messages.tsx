import { Container, Flex, ScrollArea, Text, Title, Tooltip } from '@mantine/core';
import { FC, useEffect, useRef } from 'react';
import { IMessage } from '../../../context/ChatContext';
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
    <Flex align={isCurrentUser ? 'flex-end' : 'flex-start'} className={styles['chat-message']}>
      <Text className={styles['chat-message-sender']}>
        {isCurrentUser ? 'You' : sender.username}
      </Text>
      <Text
        className={styles['chat-message-content']}
        style={{
          backgroundColor: isCurrentUser ? '#F46036' : 'white',
          color: isCurrentUser ? 'white' : 'black',
        }}
      >
        {content}
      </Text>
      <Tooltip
        label={new Date(updatedAt).toLocaleTimeString([], {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
        position='bottom'
      >
        <Text className={styles['chat-message-timestamp']}>
          {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Tooltip>
    </Flex>
  );
};

// Defines a message component that fetches the message from the server
// and renders it.
const Messages: FC = () => {
  const viewport = useRef<HTMLDivElement>(null);

  const { activeChat, messages } = useChatContext();

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
        backgroundColor: 'rgba(67, 67, 67, 0.7)',
        height: '100%',
        width: '100%',
        borderRadius: '0 0 10px 0',
        padding: 0,
      }}
    >
      <ScrollArea
        h='85%'
        type='auto'
        className='custom-scroll-bar'
        offsetScrollbars={true}
        scrollbarSize={16}
        viewportRef={viewport}
      >
        {!activeChat && (
          <Title my='20%' align='center' color='white'>
            Select a chat or create a new one
          </Title>
        )}
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
      </ScrollArea>
      <MessageInput />
    </Container>
  );
};

export default Messages;
