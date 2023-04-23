import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBan,
  IconCrown,
  IconKarate,
  IconLock,
  IconLockOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IChatUser, IRole } from '../../../context/ChatContext';
import { useSocket } from '../../../hooks/socket';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useChatContext } from '../../../hooks/useChatContext';
import styles from './ChatMembersDrawer.module.css';

type MemberButtonProps = {
  member: IChatUser;
};

type MemberWithLoadingButtonProps = MemberButtonProps & {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const KickButton: FC<MemberWithLoadingButtonProps> = ({ member, setIsLoading }) => {
  const { socket } = useSocket();
  const { activeChat } = useChatContext();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleKickMember = useCallback(
    (member: IChatUser) => {
      setIsLoading(true);
      socket?.emit('deleteMember', { chatId: activeChat?.id, userId: member.id }, () => {
        setIsLoading(false);
      });
    },
    [socket, activeChat, member],
  );

  return (
    <div hidden={member.role === 'owner'}>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        centered
        size={300}
        title='Kick member'
      >
        <Text>
          Are you sure you want to kick {member.username} from the {activeChat?.name} chat?
        </Text>
        <Flex justify='space-between' mt='md' gap='md'>
          <Button
            leftIcon={<IconKarate />}
            variant='outline'
            color='red'
            size='sm'
            fullWidth
            onClick={() => {
              handleKickMember(member);
              close();
            }}
          >
            Kick
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
      <Tooltip label='Kick' position='left-start'>
        <ActionIcon
          variant='subtle'
          color='red'
          radius='xl'
          size='lg'
          onClick={() => {
            toggle();
          }}
        >
          <IconBan />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

const MuteButton: FC<MemberButtonProps> = ({ member }) => {
  const { socket } = useSocket();
  const { activeChat } = useChatContext();
  const { user } = useAuthContext();

  const toggleMute = useCallback(
    (member: IChatUser) => {
      socket?.emit('updateMember', {
        chatId: activeChat?.id,
        userId: member.id,
        status: member.status === 'active' ? 'muted' : 'active',
      });
    },
    [activeChat, socket],
  );

  const userRole = activeChat?.users.find((m) => m.id === user?.id)?.role;

  return (
    <div hidden={member.role === 'owner'}>
      <Tooltip label={member.status === 'active' ? 'Mute' : 'Unmute'} position='left-start'>
        <ActionIcon
          variant='subtle'
          color='lightBlue'
          radius='xl'
          size='lg'
          disabled={!(userRole === 'owner' || (userRole === 'admin' && member.role !== 'owner'))}
          onClick={() => {
            toggleMute(member);
          }}
        >
          {member.status === 'muted' ? <IconMicrophoneOff /> : <IconMicrophone />}
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

const AdminButton: FC<MemberWithLoadingButtonProps> = ({ member, setIsLoading }) => {
  const { socket } = useSocket();
  const { activeChat } = useChatContext();

  const toggleAdmin = useCallback(
    (user: IChatUser) => {
      setIsLoading(true);
      socket?.emit(
        'updateMember',
        {
          chatId: activeChat?.id,
          userId: user.id,
          role: user.role === 'admin' ? 'member' : 'admin',
        },
        () => {
          setIsLoading(false);
        },
      );
    },
    [activeChat, socket],
  );

  return (
    <div hidden={member.role === 'owner'}>
      <Tooltip
        label={member.role === 'admin' ? 'Demote To Member' : 'Promote to Admin'}
        position='left-start'
      >
        <ActionIcon
          variant='subtle'
          color='yellow'
          radius='xl'
          size='lg'
          onClick={() => {
            toggleAdmin(member);
          }}
        >
          {member.role === 'admin' ? <IconLock /> : <IconLockOff />}
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

const ChatMembersDrawer: FC<{ close: () => void }> = ({ close }) => {
  const { user } = useAuthContext();
  const { activeChat } = useChatContext();
  const { socketUsersList } = useSocket();
  const [membersList, setMembersList] = useState<IChatUser[]>([]);
  const [filteredMembersList, setFilteredMembersList] = useState<IChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendSearched, setFriendSearched] = useState('');
  const [isActiveChatAdmin, setIsActiveChatAdmin] = useState(false);

  const sortMembersList = useCallback(
    (membersList: IChatUser[]) => {
      return membersList.sort((a, b) => {
        if (a.role === 'owner' && b.role !== 'owner') {
          return -1;
        } else if (a.role !== 'owner' && b.role === 'owner') {
          return 1;
        } else if (a.role === 'admin' && b.role !== 'admin') {
          return -1;
        } else if (a.role !== 'admin' && b.role === 'admin') {
          return 1;
        } else {
          return a.firstName.localeCompare(b.firstName);
        }
      });
    },
    [setFilteredMembersList],
  );

  useEffect(() => {
    setMembersList(activeChat?.users || []);
    setFilteredMembersList(sortMembersList(activeChat?.users || []));

    const role = activeChat?.users.find(({ id }) => id === user?.id)?.role;
    setIsActiveChatAdmin(role === 'member' ? false : true);
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

  const getBadge = (role: IRole) => {
    if (role === 'member') {
      return;
    }

    const icon =
      role === 'owner' ? (
        <IconCrown size='1rem' style={{ margin: '4px 0 0 0' }} />
      ) : (
        <IconLock size='1rem' style={{ margin: '4px 0 0 0' }} />
      );

    return (
      <Badge leftSection={icon} variant='outline' color='secondary' className={styles['badge']}>
        {role}
      </Badge>
    );
  };

  const getMemberRole = (member: IChatUser) => {
    return activeChat?.users.find(({ id }) => id === member.id)?.role || 'member';
  };

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
    <Card shadow='xl' px={20} p={16} h={800} w={'100%'} style={{ position: 'relative' }}>
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
        {filteredMembersList.map((member) => (
          <Card
            key={member.id}
            my={6}
            px={10}
            radius={8}
            w='100%'
            mih={69}
            className={styles['friend-card']}
          >
            <Flex align='center'>
              <Link className={styles['link']} to={`/profile/${member.id}`}>
                <Avatar
                  radius='50%'
                  size={48}
                  mr={20}
                  className={styles['friend-avatar']}
                  src={'/images/cat-pirate.jpg'}
                  alt='friend avatar'
                />
              </Link>

              <Flex direction='column'>
                <Title color='white' order={4}>
                  {member.firstName}
                </Title>
                <Text w={140} italic size='0.7rem' color='grey' truncate>
                  {member.username}
                </Text>
              </Flex>
            </Flex>
            <Flex align='center'>
              {getBadge(getMemberRole(member))}
              <Badge
                variant='dot'
                className={styles['badge']}
                color={getStatusColor(socketUsersList[member.id]?.status)}
              >
                {socketUsersList[member.id]?.status || 'offline'}
              </Badge>
              <MuteButton member={member} />
              {isActiveChatAdmin && (
                <>
                  <AdminButton member={member} setIsLoading={setIsLoading} />
                  <KickButton member={member} setIsLoading={setIsLoading} />
                </>
              )}
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

export default ChatMembersDrawer;
