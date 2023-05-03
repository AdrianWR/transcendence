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
  Modal,
  ActionIcon,
  Box,
} from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';
import { Link } from 'react-router-dom';
import styles from './FriendsListCard.module.css';
import { IUser } from '../../../context/AuthContext';
import {
  IconBan,
  IconHeartHandshake,
  IconMoodPlus,
  IconSearch,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import FriendRequestsModal from '../FriendRequestsModal';
import { useSocket } from '../../../hooks/socket';
import { useChatContext } from '../../../hooks/useChatContext';

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

interface BlockButtonProps {
  isLoggedUser: boolean;
  friend: IUser;
}

const BlockButton: FC<BlockButtonProps> = ({ isLoggedUser, friend }) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const notificationTitle = 'Friends';
  const [isLoading, setIsLoading] = useState(false);
  const { updateFriendListChats } = useChatContext();

  const handleBlockFriend = useCallback(async (friend: IUser) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/chats/${friend.id}/block`);
      success('Successfully blocked friend');
      updateFriendListChats(data.user.id, data.chat.id);
    } catch (err) {
      if (err instanceof AxiosError) alert(err.response?.data.message, notificationTitle);
      else alert('Something went wrong while trying to block friend', notificationTitle);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUnblockFriend = useCallback(async (friend: IUser) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/chats/${friend.id}/unblock`);
      success('Successfully unblocked friend');
      updateFriendListChats(data.user.id, data.chat.id);
    } catch (err) {
      if (err instanceof AxiosError) alert(err.response?.data.message, notificationTitle);
      else alert('Something went wrong while trying to unblock friend', notificationTitle);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Box hidden={!isLoggedUser} style={{ position: 'relative' }}>
      <LoadingOverlay
        loaderProps={{ color: 'secondary', size: 'sm' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={2}
      />
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        centered
        size={340}
        title='Block friend'
      >
        <LoadingOverlay
          loaderProps={{ color: 'secondary' }}
          overlayOpacity={0.2}
          visible={isLoading}
          overlayBlur={1}
        />
        <Text>
          Are you sure you want to block{' '}
          <Text span color='red' weight='bolder'>
            {friend.username}
          </Text>
          ?
        </Text>
        <Text mt={6} size='xs' italic>
          You will not be able to send or receive DMs from each other and will not see each other
          messages on public/private chats. Later you can unblock if you make peace :)
        </Text>
        <Flex justify='space-between' mt='md' gap='md'>
          <Button
            leftIcon={<IconBan />}
            variant='outline'
            color='red'
            size='sm'
            fullWidth
            onClick={() => {
              handleBlockFriend(friend);
              close();
            }}
          >
            BLock
          </Button>
          <Button
            leftIcon={<IconX />}
            variant='outline'
            color='gray'
            size='sm'
            fullWidth
            onClick={close}
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
      <Tooltip label='Block'>
        <ActionIcon variant='subtle' color='red' radius='xl' size='lg' onClick={toggle}>
          <IconBan />
        </ActionIcon>
      </Tooltip>
      <Tooltip label='Unblock'>
        <ActionIcon
          variant='subtle'
          color='lightBlue'
          radius='xl'
          size='lg'
          onClick={() => handleUnblockFriend(friend)}
        >
          <IconHeartHandshake />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
};

const FriendsListCard: FC<FriendsListCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const { socketUsersList } = useSocket();
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
    if (!userId) return;
    setIsLoading(true);
    api
      .get(`/friends/${userId}`)
      .then(({ data }) => {
        setFriendsList(data);
        setFilteredFriendsList(data);
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
            mih={90}
            mah={90}
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
              <Badge
                mr={6}
                variant='dot'
                color={getStatusColor(socketUsersList[friend.id]?.status)}
              >
                {socketUsersList[friend.id]?.status || 'offline'}
              </Badge>
            </Link>
            <BlockButton friend={friend} isLoggedUser={isLoggedUser} />
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
