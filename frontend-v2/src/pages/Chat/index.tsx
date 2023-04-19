import { Container } from '@mantine/core';
import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Chat/Sidebar';
import styles from './Chat.module.css';

const ChatPage = () => {
  return (
    <Container className={styles['container']}>
      <Sidebar className={styles['sidebar']} />
      <Chat className={styles['chat']} />
    </Container>
  );
};

export default ChatPage;
