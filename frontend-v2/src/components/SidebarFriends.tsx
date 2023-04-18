import { Avatar, DefaultProps, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { IChat } from '../context/ChatContext';
import { useSocket } from '../hooks/socket';
import { useChatContext } from '../hooks/useChatContext';

interface ChatItemProps extends DefaultProps {
  chat: IChat;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { hovered, ref } = useHover();
  const { setActiveChat } = useChatContext();

  return (
    <UnstyledButton onClick={() => setActiveChat(chat)}>
      <Group
        py={'xs'}
        pl={'sm'}
        ref={ref}
        style={{
          backgroundColor: hovered ? 'black' : 'transparent',
          cursor: 'pointer',
        }}
      >
        <Avatar src={chat.avatar} radius='xl' size='sm' />
        <Stack spacing='xs' align='flex-start' justify='space-around'>
          <Text size='md' weight='bold'>
            {chat.name}
          </Text>
          <Text size='xs'>{chat.lastMessage ?? ''}</Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
};

const SidebarFriends: FC<PropsWithChildren> = () => {
  const [chats, setChats] = useState<IChat[]>();

  const { socket } = useSocket();
  const { activeChat, setActiveChat } = useChatContext();

  useEffect(() => {
    // Get current user chats
    socket.on('listRooms', (rooms: IChat[]) => setChats(rooms));
  }, []);

  useEffect(() => {
    console.log('Active chat:', activeChat);
  }, [activeChat]);

  return (
    <div>
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default SidebarFriends;
