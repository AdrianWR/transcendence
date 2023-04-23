import { Container } from '@mantine/core';
import { useEffect } from 'react';
import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Chat/Sidebar';
import { useSocket } from '../../hooks/socket';
import styles from './Chat.module.css';

const ChatPage = () => {
  const { socket, updateSocketUserStatus } = useSocket();

  useEffect(() => {
    if (socket) updateSocketUserStatus('chat');
  }, [socket]);

  return (
    <Container className={styles['container']}>
      <Sidebar />
      <Chat />
    </Container>
  );
};

export default ChatPage;
