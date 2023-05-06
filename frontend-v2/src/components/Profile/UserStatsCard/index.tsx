import {
  ActionIcon,
  Card,
  Flex,
  LoadingOverlay,
  Modal,
  Progress,
  Title,
  Text,
} from '@mantine/core';
import { FC, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';
import { IconTrophy } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { createAchievementsList, levelsDict } from './achievements';
import styles from './UserStatsCard.module.css';

export interface IUserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
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
  const [opened, { open, close }] = useDisclosure(false);
  const notificationTitle = 'User Stats';

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/users/${userId}/stats`) // change to endpoint with user stats
      .then(() => {
        // setUserStats(data);

        success('Successfully fetched user data', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetching user data', notificationTitle);
        }
      })
      .finally(() =>
        setInterval(() => {
          setUserStats({
            // remove this once we have the endpoint
            gamesPlayed: 22,
            wins: 10,
            losses: 10,
          });
          setIsLoading(false);
        }, 2000),
      );
  }, [user, userId]);

  const winRate = useMemo(() => {
    const { wins, gamesPlayed } = userStats;

    if (!gamesPlayed) return 0;

    return ((wins / gamesPlayed) * 100).toFixed(1);
  }, [userStats]);

  const achievements = useMemo(() => {
    return createAchievementsList(userStats);
  }, [userStats]);

  const rank = useMemo(() => {
    const xp = achievements.reduce((sum, achievement) => sum + achievement.xp, 0);
    const [level, { from, to }] = Object.entries(levelsDict).find(([, { from, to }]) => {
      if (xp >= from && xp <= to) return true;
      return false;
    }) || [0, { from: 0, to: 0 }];
    const progress = ((xp - from) / (to - from)) * 100;

    return {
      xp,
      level,
      nextLevelXp: to,
      progress,
    };
  }, [achievements]);

  return (
    <Card
      bg='lightGrey'
      shadow='xl'
      h={310}
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
      <Modal title='Achievements' opened={opened} onClose={close}>
        <Flex
          p={8}
          direction='column'
          style={{ overflow: 'auto' }}
          mah='65vh'
          className='custom-scroll-bar'
        >
          {achievements.map(({ name, icon, description, xp }, index) => (
            <Flex
              key={name}
              align='center'
              justify='space-between'
              p={12}
              mt={index === 0 ? 0 : 12}
              className={styles['achievement-item']}
            >
              <Flex align='center'>
                {icon}
                <Flex direction='column' ml={10}>
                  <Title order={4}>{name}</Title>
                  <Text size='xs' italic>
                    {description}
                  </Text>
                </Flex>
              </Flex>
              <Text className={styles['xp-text']}>+{xp} XP</Text>
            </Flex>
          ))}
        </Flex>
      </Modal>
      <Flex align='center' justify='space-between' mb={12}>
        <Title color='white' order={2}>
          User Stats
        </Title>
        <ActionIcon
          className={styles['achievement-modal-button']}
          radius='xl'
          size={42}
          p={6}
          color='yellow'
          onClick={open}
        >
          <IconTrophy />
        </ActionIcon>
      </Flex>
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
        value={rank.progress}
        label={`LEVEL ${rank.level} | ${rank.xp} XP | ${Number(rank.progress).toFixed(2)} %`}
        color='lightBlue'
      />
    </Card>
  );
};

export default UserStatsCard;
