import { Button, TextInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { SetStateAction, useEffect, useState } from 'react';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import styles from './Messages.module.css';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { activeChat, isBlocked } = useChatContext();
  const { socket } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    if (activeChat) {
      // Check if user status in active chat is muted
      setIsMuted(activeChat.users.find((u) => u.id === user?.id)?.status === 'muted');
    }
  }, [activeChat]);

  const onSend = (message: string) => {
    socket?.emit('sendMessage', {
      chatId: activeChat?.id,
      content: message,
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSending(true);
    onSend(message);
    setIsSending(false);
    setMessage('');
  };

  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setMessage(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles['chat-input']}>
      {activeChat ? (
        <>
          <TextInput
            className={styles['chat-input-field']}
            placeholder='Type your message...'
            value={message}
            onChange={handleChange}
            disabled={isSending || isMuted || isBlocked}
            required
          />
          <Button
            type='submit'
            disabled={isSending || isMuted || isBlocked}
            className={styles['chat-input-button']}
          >
            <IconSend size='1.2rem' />
          </Button>
        </>
      ) : null}
    </form>
  );
};

export default MessageInput;
