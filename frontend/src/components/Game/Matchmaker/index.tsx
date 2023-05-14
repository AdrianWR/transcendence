import {
  Badge,
  Button,
  Card,
  Flex,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconMoodSad } from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMatch } from '../../../context/GameContext';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import UserAvatar from '../../UserAvatar';
import GameMenuCard from '../GameMenuCard';
import styles from './Matchmaker.module.css';

type MatchCardProps = {
  match: IMatch;
};

const MatchCard: FC<MatchCardProps> = ({ match }) => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const getStatusBadge = useCallback(
    (match: IMatch) => {
      switch (match.status) {
        case 'waiting':
          return <Badge color='blue'>Waiting for opponent</Badge>;
        case 'playing':
          return <Badge color='yellow'>In progress</Badge>;
        case 'finished':
          return <Badge color='green'>Finished</Badge>;
      }
    },
    [match.status],
  );

  return (
    <Card className={styles['match-card']}>
      <Flex direction='row' align='center' justify='space-between' gap='lg'>
        {getStatusBadge(match)}
        <UserAvatar user={match.playerOne} size='lg' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']} maw={200} truncate>
            {match.playerOne.username}
          </Text>
          <Text className={styles['match-card-player-score']}>{match.playerOneScore}</Text>
        </Stack>
        <Text>VS</Text>
        <UserAvatar user={match.playerTwo} size='lg' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']} maw={200} truncate>
            {match.playerTwo?.username ?? 'Player 2'}
          </Text>
          <Text className={styles['match-card-player-score']}>{match.playerTwoScore}</Text>
        </Stack>
        <Button
          color='secondary'
          disabled={!!match.playerTwo}
          onClick={() => {
            socket?.emit('joinGame', match.id, (match: IMatch) => navigate(`/game/${match.id}`));
          }}
        >
          Join
        </Button>
        <Button
          color='lightBlue'
          disabled={!match.playerTwo}
          onClick={() => navigate(`/game/${match.id}`)}
        >
          Watch
        </Button>
      </Flex>
    </Card>
  );
};

const Matchmaker = () => {
  const { socket } = useSocket();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [currentMatches, setCurrentMatches] = useState<IMatch[]>([]);

  useEffect(() => {
    socket?.emit('listCurrentMatches', (matches: IMatch[]) => {
      setCurrentMatches(matches);
    });

    socket?.on('listCurrentMatches', (matches: IMatch[]) => {
      setCurrentMatches(matches);
    });

    return () => {
      socket?.off('listCurrentMatches');
    };
  }, [socket]);

  return (
    <>
      <Flex align='center' justify='space-around'>
        <GameMenuCard
          onClick={() => {
            socket?.emit('createGame', { playerOne: user?.id }, (match: IMatch) => {
              navigate(`/game/${match.id}`);
            });
          }}
        >
          Create a new game room
        </GameMenuCard>
        <Space w={12} />
        <GameMenuCard
          onClick={() => {
            const availableMatches = currentMatches.filter((match) => !match.playerTwo);

            if (availableMatches.length === 0) {
              socket?.emit('createGame', { playerOne: user?.id }, (match: IMatch) => {
                navigate(`/game/${match.id}`);
              });
            } else {
              socket?.emit('joinGame', availableMatches[0].id, (match: IMatch) => {
                navigate(`/game/${match.id}`);
              });
            }
          }}
        >
          Join a random game room
        </GameMenuCard>
      </Flex>
      <Paper className={styles['matchmaker-paper']}>
        <Title color='white' mb='xl'>
          Live Games
        </Title>
        <ScrollArea type='auto' offsetScrollbars h={450}>
          <Stack spacing='md'>
            {currentMatches.length === 0 && (
              <Flex direction='column' align={'center'} justify='space-between' gap={'xl'}>
                <Text color='white' align='center' size='lg'>
                  No live games at the moment
                </Text>
                <ThemeIcon
                  size={60}
                  variant='outline'
                  color='secondary'
                  style={{ borderColor: 'transparent' }}
                >
                  <IconMoodSad size={60} stroke={1.5} />
                </ThemeIcon>
              </Flex>
            )}
            {currentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </Stack>
        </ScrollArea>
      </Paper>
    </>
  );
};

export default Matchmaker;
