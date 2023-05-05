import { Container, Group, Stack } from '@mantine/core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import GameInstructions from '../../components/Game/GameInstructions';
import GameMenuCard from '../../components/Game/GameMenuCard';
import Matchmaker from '../../components/Game/Matchmaker';
import { IMatch } from '../../context/GameContext';
import { useSocket } from '../../hooks/socket';
import { useAuthContext } from '../../hooks/useAuthContext';
import styles from './Game.module.css';

const MatchmakerPage: FCWithLayout = () => {
  const { user } = useAuthContext();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const createGame = useCallback(() => {
    socket?.emit('createGame', { playerOne: user?.id }, (match: IMatch) => {
      navigate(`/game/${match.id}`);
    });
  }, [socket, user]);

  return (
    <>
      <Container className={styles['container']}>
        <Stack>
          <Group position='center' spacing='lg' grow>
            <GameMenuCard onClick={createGame}>Create a new game room</GameMenuCard>
            {/* <GameMenuCard>Join a random game room</GameMenuCard> */}
          </Group>
          <Matchmaker />
        </Stack>
      </Container>
      <GameInstructions />
    </>
  );
};

export default MatchmakerPage;
