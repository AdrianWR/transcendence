import { Card, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { IconTrophy, IconX } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMatch } from '../../../context/GameContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';
import UserAvatar from '../../UserAvatar';

interface IPlayerStats {
  id: number;
  name: string;
  points: number;
  avatarUrl: string;
}

interface MatchHistoryCardProps {
  userId: number | undefined;
}

const MatchHistoryCard: FC<MatchHistoryCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const [matchHistory, setMatchHistory] = useState<IMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTitle = 'Match History';

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/users/${userId}/match-history`) // change to endpoint with match-history
      .then(({ data }) => {
        console.log('Match History: ', data);
        setMatchHistory(data);
        success('Successfully fetched user data', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetching match history', notificationTitle);
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  return (
    <Card
      bg='lightGrey'
      shadow='xl'
      px={20}
      p={16}
      h={380}
      style={{ position: 'relative', backgroundColor: 'rgba(45, 45, 45, 0.5)' }}
    >
      <LoadingOverlay
        loaderProps={{ color: 'secondary', variant: 'bars' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={1}
      />
      <Title color='white' order={2} mb={12}>
        Match History
      </Title>
      <Flex
        className='custom-scroll-bar'
        direction='column'
        align='center'
        mb={24}
        mah={290}
        style={{ overflow: 'auto' }}
      >
        {matchHistory.map((match, index) => (
          <Card
            key={`${index}`}
            my={6}
            p={24}
            radius={8}
            w='95%'
            mih={72}
            withBorder
            style={{
              border: '1px solid #F46036',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link to={`/game/${match?.id}`}>
              <Title color='white' order={4} truncate maw={100}>
                {match?.id}
              </Title>
            </Link>
            <Group
              styles={{
                display: 'flex',
                flex: 4,
                align: 'center',
                justifyContent: 'space-between',
                border: '2px solid white',
              }}
            >
              <UserAvatar user={match.playerOne} />
              <Title order={4} color='white'>
                {match?.playerOne.firstName}
              </Title>
              <Title order={3} color='white'>
                {match.playerOneScore} x {match.playerTwoScore}
              </Title>
              <Title order={4} color='white'>
                {match.playerTwo?.firstName}
              </Title>
              <UserAvatar user={match.playerTwo} size={'md'} />
            </Group>
            {match.playerOneScore > match.playerTwoScore ? (
              <IconTrophy color='yellow' />
            ) : (
              <IconX color='red' />
            )}
          </Card>
        ))}
      </Flex>
    </Card>
  );
};

export default MatchHistoryCard;
