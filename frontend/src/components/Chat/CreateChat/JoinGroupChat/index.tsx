import { Button, Card, Flex, Group, Stack } from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { IChat } from '../../../../context/ChatContext';
import { useSocket } from '../../../../hooks/socket';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { UserAvatarGroup } from '../../../UserAvatar';

type JoinGroupChatModalProps = {
  close: () => void;
};

const JoinGroupChatModal: FC<JoinGroupChatModalProps> = ({ close }) => {
  const [publicChats, setPublicChats] = useState<IChat[]>([]);
  const { socket } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    socket?.emit('listPublicChats', (chats: IChat[]) => {
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
                <UserAvatarGroup users={chat.users} />
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
