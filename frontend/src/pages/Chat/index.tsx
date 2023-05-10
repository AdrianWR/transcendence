import { Container } from '@mantine/core';
import { useEffect } from 'react';
import { FCWithLayout } from '../../App';
import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Chat/Sidebar';
import Layout from '../../components/Layout';
import { useSocket } from '../../hooks/socket';
import { useChatContext } from '../../hooks/useChatContext';
import styles from './Chat.module.css';

const ChatPage: FCWithLayout = () => {
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

ChatPage.getLayout = function getLayout(page) {
  return <Layout imageSrc='/images/pretty-nebula.png'>{page}</Layout>;
};

export default ChatPage;
