import { Button, TextInput, Tooltip } from '@mantine/core';
import { IconDeviceGamepad, IconSend } from '@tabler/icons-react';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMatch } from '../../../context/GameContext';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import { DM_BLOCKED } from './Messages';
import styles from './Messages.module.css';

const GameButton = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { activeChat } = useChatContext();
  const { socket } = useSocket();

  const playerOne = user?.id;
  const playerTwo = activeChat?.users.find((u) => u.id !== user?.id)?.id;

  const createGame = useCallback(() => {
    socket?.emit('createGame', { playerOne, playerTwo }, (match: IMatch) => {
      socket?.emit('sendMessage', {
        chatId: activeChat?.id,
        content: `Join me for a game of Pong! Find me at ${window.location.origin}/game/${match.id} :)`,
      });
      navigate(`/game/${match.id}`);
    });
  }, [socket, user]);

  return (
    <Tooltip label='Invite to game' position='top-start'>
      <Button type='button' onClick={createGame} className={styles['chat-game-button']}>
        <IconDeviceGamepad size='1.2rem' />
      </Button>
    </Tooltip>
  );
};

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dmBlocked, setDmBlocked] = useState(DM_BLOCKED.NOT_BLOCKED);

  const { activeChat, isBlocked } = useChatContext();
  const { socket } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    if (activeChat) {
      // Check if user status in active chat is muted
      setIsMuted(activeChat.users.find((u) => u.id === user?.id)?.status === 'muted');
      if (activeChat?.type === 'direct') {
        const loggedUser = activeChat?.users.find((u) => u.id === user?.id);
        const friend = activeChat?.users.find((u) => u.id !== user?.id);
        if (loggedUser?.status == 'blocked') setDmBlocked(DM_BLOCKED.BY_FRIEND);
        else if (friend?.status == 'blocked') setDmBlocked(DM_BLOCKED.BY_USER);
        else setDmBlocked(DM_BLOCKED.NOT_BLOCKED);
      } else setDmBlocked(DM_BLOCKED.NOT_BLOCKED);
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
            disabled={isSending || isMuted || isBlocked || dmBlocked !== DM_BLOCKED.NOT_BLOCKED}
            required
          />
          {activeChat.type === 'direct' && dmBlocked === DM_BLOCKED.NOT_BLOCKED && <GameButton />}
          <Tooltip label='Send message' position='top-start'>
            <Button
              type='submit'
              disabled={isSending || isMuted || isBlocked || dmBlocked !== DM_BLOCKED.NOT_BLOCKED}
              className={styles['chat-input-button']}
            >
              <IconSend size='1.2rem' />
            </Button>
          </Tooltip>
        </>
      ) : null}
    </form>
  );
};

export default MessageInput;
