import {
  ActionIcon,
  Avatar,
  Card,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconMessagePlus, IconSearch } from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../../context/AuthContext';
import { useSocket } from '../../../hooks/socket';
import { useChatContext } from '../../../hooks/useChatContext';
import api from '../../../services/api';
import styles from './ListAllUsers.module.css';

interface ListAllUsersCardProps {
  mode: 'chat' | 'profile';
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

  const showChatButton = (user: IUser) => {
    const addMember = (user: IUser) => {
      socket?.emit('joinChat', { chatId: activeChat?.id, userIds: [user.id] });
      close();
    };

    return (
      <ActionIcon
        key={user.id}
        color='yellow'
        variant='transparent'
        radius={8}
        onClick={() => addMember(user)}
      >
        <IconMessagePlus size={48} color='yellow' />
      </ActionIcon>
    );
  };

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
              <Link className={styles['link']} to={`/profile/${user.id}`}>
                <Avatar
                  radius='50%'
                  size={48}
                  mr={20}
                  className={styles['friend-avatar']}
                  src={user.avatarUrl || '/images/cat-pirate.jpg'}
                  alt='friend avatar'
                />
              </Link>

              <Flex direction='column'>
                <Title color='white' order={4}>
                  {user.firstName}
                </Title>
                <Text w={140} italic size='0.7rem' color='grey' truncate>
                  {user.username}
                </Text>
              </Flex>
            </Flex>
            <Flex align='center'>{mode === 'chat' && showChatButton(user)}</Flex>
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
