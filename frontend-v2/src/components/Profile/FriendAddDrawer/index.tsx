import {
  ActionIcon,
  Card,
  Drawer,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconMoodPlus, IconSearch } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { IUser } from '../../../context/AuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';
import UserAvatar from '../../UserAvatar';
import styles from './FriendAddDrawer.module.css';

interface FriendAddDrawerProps {
  opened: boolean;
  close: () => void;
}

const FriendAddDrawer: FC<FriendAddDrawerProps> = ({ opened, close }) => {
  const [usersList, setUsersList] = useState([] as IUser[]);
  const [filteredUsersList, setFilteredUsersList] = useState([] as IUser[]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendSearched, setFriendSearched] = useState('');
  const { activeChat } = useChatContext();

  useEffect(() => {
    setIsLoading(true);

    const toBeFriends = async () => {
      const allUsers = api.get<IUser[]>('/users');
      const friends = api.get<IUser[]>('/friends');

      return await Promise.all([allUsers, friends]).then((responses) => {
        const [allUsers, friends] = responses;

        return allUsers.data.filter((user: IUser) => {
          if (friends.data) {
            return !friends.data.find((friend) => friend.id === user.id);
          }
        });
      });
    };

    toBeFriends()
      .then((users) => {
        setUsersList(users);
        setFilteredUsersList(users);
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to load friends list', 'User Friends Error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const seachInputValue = event.currentTarget.value
        ? String(event.currentTarget.value).toLowerCase()
        : event.currentTarget.value;
      setFriendSearched(event.currentTarget.value);
      setFilteredUsersList(
        !seachInputValue
          ? usersList
          : usersList.filter(({ firstName, lastName, username }) => {
              const name = `${firstName} ${lastName}`.toLowerCase();

              return name.includes(seachInputValue) || username.includes(seachInputValue);
            }),
      );
    },
    [usersList],
  );

  const sendFriendRequest = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      try {
        await api.post('/friends/requests', { id: userId });
        success('Friend request successfully sent', 'Friends List');
      } catch (err) {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, 'Friends List');
        } else {
          alert('Failed to send friend request', 'Friends List');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [filteredUsersList],
  );

  return (
    <Drawer title='Add Friend' opened={opened} onClose={close} size='md'>
      <Card shadow='xl' px={20} p={16} style={{ position: 'relative' }}>
        <LoadingOverlay
          loaderProps={{ color: 'secondary', variant: 'bars' }}
          overlayOpacity={0.2}
          visible={isLoading}
          overlayBlur={1}
        />

        <TextInput
          px={8}
          mb={12}
          className={styles['search-input']}
          icon={<IconSearch size='0.8rem' />}
          placeholder='search members'
          value={friendSearched}
          onChange={handleSearch}
        />
        <Flex
          className='custom-scroll-bar'
          direction='column'
          align='center'
          mb={24}
          px={8}
          h='85%'
          style={{ overflow: 'auto' }}
        >
          {filteredUsersList.map((user) => (
            <Card
              key={user.id}
              my={6}
              px={10}
              radius={8}
              w='100%'
              mih={69}
              className={styles['friend-card']}
            >
              <Flex align='center'>
                <UserAvatar user={user} size={48} />
                <Flex direction='column' ml='md'>
                  <Title color='white' order={4}>
                    {user.firstName}
                  </Title>
                  <Text w={140} italic size='0.7rem' color='grey' truncate>
                    {user.username}
                  </Text>
                </Flex>
              </Flex>
              <Flex align='center' styles={{ overflow: 'visible' }}>
                <Tooltip label='Send friend request' position='right' withArrow>
                  <ActionIcon
                    key={user.id}
                    variant='subtle'
                    color='green'
                    size='lg'
                    radius='xl'
                    onClick={() => {
                      sendFriendRequest(user.id);
                    }}
                  >
                    <IconMoodPlus />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Card>
          ))}

          {!filteredUsersList.length && (
            <Text m={24} color='white'>
              No users :(
            </Text>
          )}
        </Flex>
      </Card>
    </Drawer>
  );
};

export default FriendAddDrawer;
