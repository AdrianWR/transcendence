import { Avatar, Button, Card, Flex, Group, Stack, Tooltip } from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IChat, IChatUser } from '../../../../context/ChatContext';
import { useSocket } from '../../../../hooks/socket';
import { useAuthContext } from '../../../../hooks/useAuthContext';

type UsersAvatarGroupProps = {
  users: IChatUser[];
  max?: number;
};

const UsersAvatarGroup: FC<UsersAvatarGroupProps> = ({ users, max = 3 }) => {
  const [avatars, setAvatars] = useState<JSX.Element[]>([]);
  const [more, setMore] = useState<number>(0);

  useEffect(() => {
    const avatars = users.slice(0, max).map((user) => (
      <Tooltip key={user.id} label={`${user.firstName} ${user.lastName}`} position='top'>
        <Link to={`/profile/${user.id}`}>
          <Avatar key={user.id} src={user.avatar} alt={user.firstName} radius='xl' />
        </Link>
      </Tooltip>
    ));

    setAvatars(avatars);
    setMore(users.length - max);
  }, [users]);

  return (
    <Avatar.Group spacing='sm'>
      {avatars}
      {more > 0 && (
        <Tooltip label={`${more} more`} position='top'>
          <Avatar
            radius='xl'
            style={{
              background: 'var(--mantine-colors-blue-5)',
              color: 'var(--mantine-colors-blue-9)',
            }}
          >
            +{more}
          </Avatar>
        </Tooltip>
      )}
    </Avatar.Group>
  );
};

type JoinGroupChatModalProps = {
  close: () => void;
};

const JoinGroupChatModal: FC<JoinGroupChatModalProps> = ({ close }) => {
  const [publicChats, setPublicChats] = useState<IChat[]>([]);
  const { socket } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    socket?.emit('listPublicChats', (chats: IChat[]) => {
      console.log('message received', chats);
      setPublicChats(chats);
    });
  }, []);

  const joinChat = useCallback(
    (chat: IChat) => {
      socket?.emit(
        'joinChat',
        {
          chatId: chat.id,
          userIds: [user?.id],
        },
        (success: boolean) => {
          if (success) {
            close();
          }
        },
      );
    },
    [socket],
  );

  return (
    <Stack>
      {publicChats.length === 0 && (
        <Card shadow='sm' padding='md'>
          <Flex>
            <Group style={{ width: '100%' }} spacing='md' position='apart'>
              <Stack>
                <h3>No public chats available</h3>
              </Stack>
            </Group>
          </Flex>
        </Card>
      )}
      {publicChats.map((chat) => (
        <Card key={chat.id} shadow='sm' padding='md'>
          <Flex>
            <Group style={{ width: '100%' }} spacing='md' position='apart'>
              <Stack>
                <h3>{chat.name}</h3>
                <UsersAvatarGroup users={chat.users} />
              </Stack>
              <Button onClick={() => joinChat(chat)}>Join</Button>
            </Group>
          </Flex>
        </Card>
      ))}
    </Stack>
  );
};

export default JoinGroupChatModal;
