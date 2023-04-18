import { Container } from '@mantine/core';
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';
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
