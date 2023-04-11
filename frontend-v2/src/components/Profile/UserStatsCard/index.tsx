import { Card, Flex, LoadingOverlay, Progress, Title } from '@mantine/core';
import { FC, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';

interface IUserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  rank: {
    level: number;
    xp: number;
    nextLevelXp: number;
  };
}

interface UserStatsCardProps {
  userId: number | undefined;
}

const UserStatsCard: FC<UserStatsCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
  } as IUserStats);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTitle = 'User Stats';

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/users/${userId}/stats`) // change to endpoint with user stats
      .then(({ data }) => {
        // setUserStats(data);

        success('Successfully fetched user data', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetchin user data', notificationTitle);
        }
      })
      .finally(() =>
        setInterval(() => {
          setUserStats({
            gamesPlayed: 21,
            wins: 10,
            losses: 11,
            rank: {
              level: 3,
              xp: 220,
              nextLevelXp: 500,
            },
          });
          setIsLoading(false);
        }, 2000),
      );
  }, [user, userId]);

  const progress = useMemo(() => {
    if (!userStats.rank) return 0;

    const {
      rank: { xp, nextLevelXp },
    } = userStats;

    return (xp / nextLevelXp) * 100;
  }, [userStats.rank]);

  const winRate = useMemo(() => {
    const { wins, gamesPlayed } = userStats;

    if (!gamesPlayed) return 0;

    return ((wins / gamesPlayed) * 100).toFixed(1);
  }, [userStats]);

  return (
    <Card
      bg='lightGrey'
      shadow='xl'
      px={20}
      p={16}
      style={{ position: 'relative', backgroundColor: 'rgba(45, 45, 45, 0.5)' }}
    >
      <LoadingOverlay
        loaderProps={{ color: 'secondary', variant: 'bars' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={1}
      />
      <Title color='white' order={2} mb={12}>
        User Stats
      </Title>
      <Flex align='center' justify='space-between' mb={24}>
        <Card mx={12} radius={8} w={165} h={165} withBorder style={{ border: '2px solid #F46036' }}>
          <Title color='white' align='center' order={4} mb={32}>
            Games Played
          </Title>
          <Title color='white' align='center' size={52}>
            {userStats.gamesPlayed}
          </Title>
        </Card>
        <Card mx={12} radius={8} w={165} h={165} withBorder style={{ border: '2px solid #57A773' }}>
          <Title color='white' align='center' order={4} mb={32}>
            Wins
          </Title>
          <Title color='white' align='center' size={52}>
            {userStats.wins}
          </Title>
        </Card>
        <Card mx={12} radius={8} w={165} h={165} withBorder style={{ border: '2px solid #C92A2A' }}>
          <Title color='white' align='center' order={4} mb={32}>
            Losses
          </Title>
          <Title color='white' align='center' size={52}>
            {userStats.losses}
          </Title>
        </Card>
        <Card mx={12} radius={8} w={165} h={165} withBorder style={{ border: '2px solid white' }}>
          <Title color='white' align='center' order={4} mb={32}>
            Win Rate (%)
          </Title>
          <Title color='white' align='center' size={52}>
            {winRate}
          </Title>
        </Card>
      </Flex>
      <Progress
        size={32}
        styles={{
          root: { position: 'relative' },
          label: { position: 'absolute', left: 290, fontSize: 16 },
        }}
        value={progress}
        label={
          userStats.rank
            ? `LEVEL ${userStats.rank.level} | ${userStats.rank.xp} XP | ${progress} %`
            : ''
        }
        color='lightBlue'
      />
    </Card>
  );
};

export default UserStatsCard;
