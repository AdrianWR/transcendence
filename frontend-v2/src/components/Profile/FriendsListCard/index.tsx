import { Card, Flex, LoadingOverlay, Title, Text, Image } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';
import { IconTrophy, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import styles from './FriendsListCard.module.css';

interface IPlayerStats {
  id: number;
  name: string;
  points: number;
  avatarUrl: string;
}

interface IMatchStats {
  player: Omit<IPlayerStats, 'name' | 'avatarUrl'>;
  opponent: IPlayerStats;
}

interface FriendsListCardProps {
  userId: number | undefined;
}

const FriendsListCard: FC<FriendsListCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const [friendsList, setFriendsList] = useState([
    {
      player: {},
      opponent: {},
    },
  ] as IMatchStats[]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTitle = 'Match History';

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/users/${userId}/match-history`) // change to endpoint with match-history
      .then(({ data }) => {
        // setUserStats(data);

        success('Successfully fetched user data', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetchin match history', notificationTitle);
        }
      })
      .finally(() =>
        setInterval(() => {
          setFriendsList(
            [
              {
                player: {
                  id: userId,
                  points: 10,
                },
                opponent: {
                  id: 3,
                  name: 'Jorginho',
                  points: 8,
                  avatarUrl: '',
                },
              },
              {
                player: {
                  id: userId,
                  points: 2,
                },
                opponent: {
                  id: 1,
                  name: 'Maurão',
                  points: 10,
                  avatarUrl: '',
                },
              },
            ].reduce((a, c) => {
              return a.concat([c, c, c, c]);
            }, [] as IMatchStats[]),
          );
          setIsLoading(false);
        }, 2000),
      );
  }, [userId]);

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
        Match History
      </Title>
      <Flex direction='column' align='center' mb={24} mah='30vh' style={{ overflow: 'auto' }}>
        {friendsList.map(({ player, opponent }, index) => (
          <Card
            key={`${player.id}${opponent.id}${index}`}
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
            <Title color='white' order={4}>
              Game {index + 1}
            </Title>
            <Link className={styles['player-avatar']} to='/profile/me'>
              <Image
                radius='50%'
                width={48}
                height={48}
                src={user?.avatarUrl || '/images/cat-pirate.jpg'}
                alt='user avatar'
              />
            </Link>
            <Title order={4} color='white'>
              {user?.firstName}
            </Title>
            <Title order={3} color='white'>
              {player.points} x {opponent.points}
            </Title>
            <Title order={4} color='white'>
              {opponent.name}
            </Title>
            <Link className={styles['opponent-avatar']} to={`/profile/${opponent.id}`}>
              <Image
                radius='50%'
                width={48}
                height={48}
                src={opponent.avatarUrl || '/images/cat-pirate.jpg'}
                alt='opponent avatar'
              />
            </Link>
            {player.points > opponent.points ? (
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

export default FriendsListCard;
