import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconSearch, IconSend } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../../context/AuthContext';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import api from '../../../services/api';
import { alert } from '../../Notifications';
import styles from './DirectMessageCreateModal.module.css';

export interface IFriendRequest {
  id: number;
  accepted_date: boolean | null;
  status: 'pending' | 'accepted';
  createdAt: string;
  updatedAt: string;
  sender: IUser;
  recipient: IUser;
}

interface IDMModalProps {
  close(): void;
}

const DirectMessageCreateModal: FC<IDMModalProps> = ({ close }) => {
  const { socketUsersList } = useSocket();
  const { user } = useAuthContext();
  const { chats, createDirectMessage } = useChatContext();
  const notificationTitle = 'Direct Message';
  const [usersList, setUsersList] = useState([] as IUser[]);
  const [filteredUsersList, setFilteredUsersList] = useState([] as IUser[]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendSearched, setFriendSearched] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/users')
      .then(({ data }) => {
        const indexedDMUsers = chats.reduce((acc, chat) => {
          const { users, type } = chat;
          if (type === 'direct') {
            const [user1, user2] = users;

            return { ...acc, [user1.id]: true, [user2.id]: true };
          }
          return acc;
        }, {} as { [userId: number]: boolean });

        const users = (data || []).filter((u: IUser) => u.id !== user?.id && !indexedDMUsers[u.id]);

        setUsersList(users);
        setFilteredUsersList(users);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Error occured while fetching users list', notificationTitle);
        }
      })
      .finally(() => setIsLoading(false));
  }, [chats, user]);

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

  const emitCreateDM = useCallback(
    async (friendId: number) => {
      createDirectMessage(friendId);
      close();
    },
    [createDirectMessage],
  );

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
    <Card shadow='xl' px={20} p={16} h={400} style={{ position: 'relative' }}>
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
        placeholder='search users'
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
        {filteredUsersList.map((friend) => (
          <Card
            key={friend.id}
            my={6}
            px={10}
            radius={8}
            w='100%'
            mih={69}
            className={styles['friend-card']}
          >
            <Flex align='center'>
              <Link className={styles['link']} to={`/profile/${friend.id}`}>
                <Avatar
                  radius='50%'
                  size={48}
                  mr={20}
                  className={styles['friend-avatar']}
                  src={friend.avatarUrl}
                  alt='friend avatar'
                />
              </Link>

              <Flex direction='column'>
                <Title color='white' order={4}>
                  {friend.firstName}
                </Title>
                <Text w={140} italic size='0.7rem' color='grey' truncate>
                  {friend.username}
                </Text>
              </Flex>
            </Flex>
            <Flex align='center'>
              <Badge variant='dot' color={getStatusColor(socketUsersList[friend.id]?.status)}>
                {socketUsersList[friend.id]?.status || 'offline'}
              </Badge>
              <Button onClick={() => emitCreateDM(friend.id)} radius={8} color='secondary' ml={16}>
                <IconSend size='1rem' />
              </Button>
            </Flex>
          </Card>
        ))}

        {!filteredUsersList.length && (
          <Text m={24} color='white'>
            No friends :(
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default DirectMessageCreateModal;
