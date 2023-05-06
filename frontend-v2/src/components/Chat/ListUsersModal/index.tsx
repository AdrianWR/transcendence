import {
  ActionIcon,
  Card,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconMessagePlus, IconSearch } from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { IUser } from '../../../context/AuthContext';
import { useSocket } from '../../../hooks/socket';
import { useChatContext } from '../../../hooks/useChatContext';
import api from '../../../services/api';
import UserAvatar from '../../UserAvatar';
import styles from './ListUsersModal.module.css';

interface ListAllUsersCardProps {
  mode: 'chat' | 'friends';
  close: () => void;
}

const ListAllUsersCard: FC<ListAllUsersCardProps> = ({ mode, close }) => {
  const [usersList, setUsersList] = useState([] as IUser[]);
  const [filteredUsersList, setFilteredUsersList] = useState([] as IUser[]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendSearched, setFriendSearched] = useState('');
  const { socket } = useSocket();
  const { activeChat } = useChatContext();

  useEffect(() => {
    api.get('/users').then((response) => {
      let users;

      if (mode === 'chat') {
        users = response.data.filter((user: IUser) => {
          if (activeChat?.users) {
            return !activeChat.users.find((chatUser) => chatUser.id === user.id);
          }
        });
      } else {
        users = response.data;
      }
      setUsersList(users);
      setFilteredUsersList(users);
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

  const addMember = useCallback(
    (user: IUser) => {
      socket?.emit('joinChat', { chatId: activeChat?.id, userIds: [user.id] });
      close();
    },
    [socket],
  );

  return (
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
            <Flex align='center'>
              <Tooltip label='Add to chat' position='left' withArrow>
                <ActionIcon
                  key={user.id}
                  color='yellow'
                  variant='subtle'
                  size='lg'
                  radius='xl'
                  onClick={() => addMember(user)}
                >
                  <IconMessagePlus color='yellow' />
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
  );
};

export default ListAllUsersCard;
