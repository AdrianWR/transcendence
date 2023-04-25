import { Container, Group, Stack } from '@mantine/core';
import { FCWithLayout } from '../../App';
import GameMenuCard from '../../components/Game/GameMenuCard';
import Matchmaker from '../../components/Game/Matchmaker';
import styles from './Game.module.css';

const MatchmakerPage: FCWithLayout = () => {
  return (
    <Container className={styles['container']}>
      <Stack
        styles={{
          marginTop: '10%',
        }}
      >
        <Group>
          <GameMenuCard route='/game'>Create a new game room</GameMenuCard>
          <GameMenuCard route='/game'>Join a random game room</GameMenuCard>
        </Group>
        <Matchmaker />
      </Stack>
    </Container>
  );
};

export default MatchmakerPage;
