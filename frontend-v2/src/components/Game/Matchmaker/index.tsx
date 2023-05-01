import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMatch } from '../../../context/GameContext';
import { useSocket } from '../../../hooks/socket';
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
        <Avatar src={match.playerOne.avatarUrl} size='lg' radius='xl' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']}>{match.playerOne.username}</Text>
          <Text className={styles['match-card-player-score']}>{match.playerOneScore}</Text>
        </Stack>
        <Text>VS</Text>
        <Avatar src={match.playerTwo?.avatarUrl} size='lg' radius='xl' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']}>
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
        <Link to={`/game/${match.id}`}>
          <Button color='lightBlue'>Watch</Button>
        </Link>
      </Flex>
    </Card>
  );
};

const Matchmaker = () => {
  const { socket } = useSocket();
  const [currentMatches, setCurrentMatches] = useState<IMatch[]>([]);

  useEffect(() => {
    socket?.emit('listCurrentMatches', (matches: IMatch[]) => {
      setCurrentMatches(matches);
    });

    socket?.on('listCurrentMatches', (matches: IMatch[]) => setCurrentMatches(matches));

    return () => {
      socket?.off('listCurrentMatches');
    };
  }, [socket]);

  return (
    <Paper className={styles['matchmaker-paper']}>
      <Title color='white' mb='xl'>
        Live Games
      </Title>
      <ScrollArea type='auto' offsetScrollbars h={450}>
        <Stack spacing='md'>
          {currentMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

export default Matchmaker;
