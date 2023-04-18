import { TextInput } from '@mantine/core';
import { SetStateAction, useState } from 'react';
import { useSocket } from '../../hooks/socket';
import { useChatContext } from '../../hooks/useChatContext';
import styles from './Messages.module.css';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { activeChat } = useChatContext();
  const { socket } = useSocket();

  const onSend = (message: string) => {
    console.log(message);
    socket.emit('sendMessage', {
      chatId: activeChat?.id,
      content: message,
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSending(true);
    await onSend(message);
    setIsSending(false);
    setMessage('');
  };

  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setMessage(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles['chat-input']}>
      <TextInput
        className={styles['chat-input-field']}
        placeholder='Type your message...'
        value={message}
        onChange={handleChange}
        disabled={isSending}
        required
        rightSection={
          <button type='submit' className={styles['chat=input-button']}>
            Send
          </button>
        }
      />
    </form>
  );
};

export default MessageInput;
