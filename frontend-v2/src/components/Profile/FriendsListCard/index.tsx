import {
  Card,
  Flex,
  LoadingOverlay,
  Title,
  Text,
  Badge,
  Avatar,
  TextInput,
  Button,
  Tooltip,
  Indicator,
} from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';
import { Link } from 'react-router-dom';
import styles from './FriendsListCard.module.css';
import { IUser } from '../../../context/AuthContext';
import { IconMoodPlus, IconSearch, IconUsers } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import FriendRequestsModal from '../FriendRequestsModal';
import { io } from 'socket.io-client';
import { useSocket } from '../../../hooks/socket';

export interface IFriendRequest {
  id: number;
  accepted_date: boolean | null;
  status: 'pending' | 'accepted';
  createdAt: string;
  updatedAt: string;
  sender: IUser;
  recipient: IUser;
}

interface FriendsListCardProps {
  userId: number | undefined;
}

interface SocketUser extends IUser {
  status: 'online' | 'offline' | 'game' | 'chat';
}

// To-do
// - friend status (https://betterprogramming.pub/detect-active-users-in-angular-using-nestjs-and-socket-io-1efaf336b267)

const FriendsListCard: FC<FriendsListCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const { updateSocketUserStatus, socketUsersList } = useSocket();
  const notificationTitle = 'Friends List';
  const [friendsList, setFriendsList] = useState([] as IUser[]);
  const [filteredFriendsList, setFilteredFriendsList] = useState([] as IUser[]);
  const [friendRequestsList, setFriendRequestsList] = useState([] as IFriendRequest[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(true);
  const [friendSearched, setFriendSearched] = useState('');
  const [isLoggedUser, setIsLoggedUser] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (user) {
      updateSocketUserStatus('online');
    }
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/friends/${userId}`)
      .then(({ data }) => {
        setFriendsList(data);
        setFilteredFriendsList(data);

        success('Successfully fetched user data', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetching friends list', notificationTitle);
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId || userId !== user?.id) {
      setIsLoggedUser(false);
      close();
      return;
    }
    close();
    setIsLoggedUser(true);
    setIsLoading(true);
    api
      .get('/friends/requests')
      .then(({ data }) => {
        setFriendRequestsList(data);

        success('Successfully fetched user friend requests', notificationTitle);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetching friend requests', notificationTitle);
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId, user]);

  useEffect(() => {
    if (userId === user?.id) setIsAlreadyFriend(true);
    else if (friendsList.some(({ id }) => id === user?.id)) setIsAlreadyFriend(true);
    else setIsAlreadyFriend(false);

    setFilteredFriendsList(friendsList);
  }, [user, friendsList]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const seachInputValue = event.currentTarget.value
        ? String(event.currentTarget.value).toLowerCase()
        : event.currentTarget.value;
      setFriendSearched(event.currentTarget.value);
      setFilteredFriendsList(
        !seachInputValue
          ? friendsList
          : friendsList.filter(({ firstName, lastName, username }) => {
              const name = `${firstName} ${lastName}`.toLowerCase();

              return name.includes(seachInputValue) || username.includes(seachInputValue);
            }),
      );
    },
    [friendsList],
  );

  const sendFriendRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post('/friends/requests', { id: userId });
      success('Friend request successfully sent', notificationTitle);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message, notificationTitle);
      } else {
        alert('Failed to send friend request', notificationTitle);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const getStatusColor = useCallback((color: string) => {
    switch (color) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'game':
        return 'secondary';
      case 'chat':
        return 'yellow';
      default:
        return 'red';
    }
  }, []);

  return (
    <Card shadow='xl' px={20} p={16} h={380} style={{ position: 'relative' }}>
      <LoadingOverlay
        loaderProps={{ color: 'secondary', variant: 'bars' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={1}
      />

      <FriendRequestsModal
        opened={opened}
        close={close}
        friendRequestsList={friendRequestsList}
        updateFriendRequestsList={setFriendRequestsList}
        friendsList={friendsList}
        updateFriendsList={setFriendsList}
      />

      <Flex justify='space-between'>
        <Title color='white' order={2} mb={12}>
          Friends List
        </Title>
        {isLoggedUser && (
          <Tooltip label='Check pending requests'>
            <Indicator color='red' offset={4} disabled={!friendRequestsList.length}>
              <Button onClick={open} radius='xl' color='lightBlue'>
                <IconUsers size='1.2rem' />
              </Button>
            </Indicator>
          </Tooltip>
        )}
        {!isAlreadyFriend && (
          <Tooltip label='Send friend request'>
            <Button onClick={sendFriendRequest} radius='xl' color='green'>
              <IconMoodPlus size='1.2rem' />
            </Button>
          </Tooltip>
        )}
      </Flex>
      <TextInput
        px={8}
        mb={12}
        className={styles['search-input']}
        icon={<IconSearch size='0.8rem' />}
        placeholder='search friends'
        value={friendSearched}
        onChange={handleSearch}
      />
      <Flex
        className='custom-scroll-bar'
        direction='column'
        align='center'
        mb={24}
        px={8}
        mah={250}
        style={{ overflow: 'auto' }}
      >
        {filteredFriendsList.map((friend) => (
          <Card
            key={friend.id}
            my={6}
            px={10}
            radius={8}
            w='100%'
            mih={69}
            className={styles['friend-card']}
          >
            <Link className={styles['link']} to={`/profile/${friend.id}`}>
              <Flex align='center'>
                <Avatar
                  radius='50%'
                  size={48}
                  mr={20}
                  className={styles['friend-avatar']}
                  src={friend.avatarUrl || '/images/cat-pirate.jpg'}
                  alt='friend avatar'
                />
                <Flex direction='column'>
                  <Title color='white' order={4}>
                    {friend.firstName}
                  </Title>
                  <Text w={140} italic size='0.7rem' color='grey' truncate>
                    {friend.username}
                  </Text>
                </Flex>
              </Flex>
              <Badge variant='dot' color={getStatusColor(socketUsersList[friend.id]?.status)}>
                {socketUsersList[friend.id]?.status || 'offline'}
              </Badge>
            </Link>
          </Card>
        ))}
        {!filteredFriendsList.length && (
          <Text m={24} color='white'>
            No friends :(
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default FriendsListCard;
