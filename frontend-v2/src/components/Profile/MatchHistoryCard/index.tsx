import { Card, Flex, Group, LoadingOverlay, Title } from '@mantine/core';
import { IconTrophy, IconX } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { IMatch } from '../../../context/GameContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';
import UserAvatar from '../../UserAvatar';

interface MatchHistoryCardProps {
  userId: number | undefined;
}

const MatchHistoryCard: FC<MatchHistoryCardProps> = ({ userId }) => {
  const [matchHistory, setMatchHistory] = useState<IMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTitle = 'Match History';

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/users/${userId}/match-history`)
      .then(({ data }) => {
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

  const isUserWinner = useCallback(
    (match: IMatch) => {
      if (!match.playerTwo) return false;

      const winnerId =
        match.playerOneScore > match.playerTwoScore ? match.playerOne.id : match.playerTwo.id;
      return winnerId === userId;
    },
    [userId],
  );

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
              overflow: 'visible',
            }}
          >
            <Title color='white' order={6}>
              {new Date(match.createdAt).toLocaleTimeString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Title>
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
            {isUserWinner(match) ? <IconTrophy color='yellow' /> : <IconX color='red' />}
          </Card>
        ))}
      </Flex>
    </Card>
  );
};

export default MatchHistoryCard;
