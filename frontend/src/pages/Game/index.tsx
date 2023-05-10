import { Container, Stack } from '@mantine/core';
import { useEffect } from 'react';
import { FCWithLayout } from '../../App';
import GameInstructions from '../../components/Game/GameInstructions';
import Matchmaker from '../../components/Game/Matchmaker';
import { useSocket } from '../../hooks/socket';
import styles from './Game.module.css';

const MatchmakerPage: FCWithLayout = () => {
  const { socket, updateSocketUserStatus } = useSocket();

  useEffect(() => {
    if (socket) updateSocketUserStatus('online');
  }, [socket]);

  return (
    <Container className={styles['container']}>
      <Stack
        styles={{
          marginTop: '10%',
        }}
      >
        <Matchmaker />
      </Stack>
      <GameInstructions />
    </Container>
  );
};

export default MatchmakerPage;
