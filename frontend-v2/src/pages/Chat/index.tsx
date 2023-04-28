import { Container } from '@mantine/core';
import { useEffect } from 'react';
import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Chat/Sidebar';
import { useSocket } from '../../hooks/socket';
import styles from './Chat.module.css';
import { useChatContext } from '../../hooks/useChatContext';

const ChatPage = () => {
  const { socket, updateSocketUserStatus } = useSocket();
  const { listChats } = useChatContext();

  useEffect(() => {
    if (socket) updateSocketUserStatus('chat');
  }, [socket]);

  useEffect(() => {
    listChats();
  }, []);

  return (
    <Container className={styles['container']}>
      <Sidebar />
      <Chat />
    </Container>
  );
};

export default ChatPage;
