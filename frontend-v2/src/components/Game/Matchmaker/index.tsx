import { Avatar, Badge, Button, Card, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { FC } from 'react';
import styles from './Matchmaker.module.css';

type MatchCardProps = {
  match: {
    id: number;
    status: string;
    players: {
      id: number;
      name: string;
      avatar: string;
      score: number;
    }[];
  };
};

const MatchCard: FC<MatchCardProps> = ({ match }) => {
  return (
    <Card className={styles['match-card']}>
      <Flex direction='row' align='center' justify='space-between' gap='lg'>
        <Badge color='red' variant='dot'>
          {match.status}
        </Badge>
        <Avatar src={match.players[0].avatar} size='lg' radius='xl' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']}>{match.players[0].name}</Text>
          <Text className={styles['match-card-player-score']}>{match.players[0].score}</Text>
        </Stack>
        <Text>VS</Text>
        <Avatar src={match.players[1].avatar} size='lg' radius='xl' />
        <Stack spacing={1} align='center'>
          <Text className={styles['match-card-player-name']}>{match.players[1].name}</Text>
          <Text className={styles['match-card-player-score']}>{match.players[1].score}</Text>
        </Stack>
        <Button color='secondary'>Join</Button>
        <Button color='lightBlue'>Watch</Button>
      </Flex>
    </Card>
  );
};

const Matchmaker = () => {
  const matchList = [
    {
      id: 1,
      status: 'in-progress',
      players: [
        {
          id: 1,
          name: 'Player 1',
          avatar: 'https://i.pravatar.cc/300?img=1',
          score: 0,
        },
        {
          id: 2,
          name: 'Player 2',
          avatar: 'https://i.pravatar.cc/300?img=2',
          score: 0,
        },
      ],
    },
  ];

  return (
    <Paper className={styles['matchmaker-paper']}>
      <Title color='white' mb='xl'>
        Live Games
      </Title>

      <Stack spacing='md'>
        {matchList.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </Stack>
    </Paper>
  );
};

export default Matchmaker;
