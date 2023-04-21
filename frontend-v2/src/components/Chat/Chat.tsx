import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessages, IconMoodPlus, IconSearch, IconUsers } from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../context/AuthContext';
import { useSocket } from '../../hooks/socket';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import ListAllUsersCard from '../Users/ListAllUsersCard';
import styles from './ChatMembersModal.module.css';
import Messages from './Messages/Messages';

const ChatMembersModal: FC<{ close: () => void }> = ({ close }) => {
  const { user } = useAuthContext();
  const { socketUsersList } = useSocket();
  const notificationTitle = 'Direct Message';
  const [membersList, setMembersList] = useState([] as IUser[]);
  const [filteredMembersList, setFilteredMembersList] = useState([] as IUser[]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendSearched, setFriendSearched] = useState('');
  const { activeChat } = useChatContext();

  useEffect(() => {
    setMembersList(activeChat?.users || []);
    setFilteredMembersList(activeChat?.users || []);
  }, [activeChat]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const seachInputValue = event.currentTarget.value
        ? String(event.currentTarget.value).toLowerCase()
        : event.currentTarget.value;
      setFriendSearched(event.currentTarget.value);
      setFilteredMembersList(
        !seachInputValue
          ? membersList
          : membersList.filter(({ firstName, lastName, username }) => {
              const name = `${firstName} ${lastName}`.toLowerCase();

              return name.includes(seachInputValue) || username.includes(seachInputValue);
            }),
      );
    },
    [membersList],
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
        {filteredMembersList.map((friend) => (
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
                  src={friend.avatarUrl || '/images/cat-pirate.jpg'}
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
              {/* {const role = activeChat?.users.find(({ id }) => id === friend.id)?.role;
                role === 'owner' && (
              }} */}
              <Badge variant='dot'>Owner</Badge>
              <Badge variant='dot' color={getStatusColor(socketUsersList[friend.id]?.status)}>
                {socketUsersList[friend.id]?.status || 'offline'}
              </Badge>
            </Flex>
          </Card>
        ))}

        {!filteredMembersList.length && (
          <Text m={24} color='white'>
            No members :(
          </Text>
        )}
      </Flex>
    </Card>
  );
};

const AddFriendModal: FC<{ close: () => void }> = ({ close }) => {
  return <ListAllUsersCard mode='chat' close={close} />;
};

const Chat: FC = () => {
  const { activeChat } = useChatContext();
  const { user } = useAuthContext();
  const [chatName, setChatName] = useState('Chats');
  const [membersOpened, { open: membersOpen, close: membersClose }] = useDisclosure(false);
  const [addMemberOpened, { open: addMemberOpen, close: addMemberClose }] = useDisclosure(false);

  useEffect(() => {
    if (activeChat?.type === 'direct') {
      const { firstName, lastName } = activeChat?.users.find(({ id }) => id != user?.id) || {};

      setChatName(firstName ? `${firstName} ${lastName}` : 'Direct Message');
    } else {
      setChatName(activeChat?.name || 'Chats');
    }
  }, [activeChat, user]);

  return (
    <>
      <Modal opened={addMemberOpened} onClose={addMemberClose} title='Add a Friend'>
        <AddFriendModal close={addMemberClose} />
      </Modal>
      <Modal opened={membersOpened} onClose={membersClose} title='Chat Members'>
        <ChatMembersModal close={membersClose} />
      </Modal>
      <Flex direction='column' style={{ flex: 2 }}>
        <Group
          p='lg'
          h={72}
          style={{
            backgroundColor: '#2f252f',
            borderRadius: '0 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <IconMessages size={32} color='green' />
          <Text color='white' size='xl' w='fit-content' maw='20vw' truncate>
            {chatName}
          </Text>
          {activeChat?.type !== 'direct' && (
            <Tooltip label='Add a member' position='top-start'>
              <ActionIcon
                variant='filled'
                color='lightBlue'
                radius='xl'
                size='lg'
                onClick={() => {
                  addMemberOpen();
                }}
              >
                <IconMoodPlus />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label='Members' position='top-start'>
            <ActionIcon
              variant='filled'
              color='secondary'
              radius='xl'
              size='lg'
              onClick={() => {
                membersOpen();
              }}
            >
              <IconUsers />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Messages />
      </Flex>
    </>
  );
};

export default Chat;
