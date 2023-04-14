import { Avatar, DefaultProps, Group, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useChatContext } from '../hooks/useChatContext';

type Chat = {
  id: string;
  name: string;
};

interface ChatItemProps extends DefaultProps {
  name: string;
  avatar: string | null;
  lastMessage?: string;
}

const ChatItem: FC<ChatItemProps> = ({ name, avatar, lastMessage }) => {
  const { hovered, ref } = useHover();

  return (
    <Group
      py={'xs'}
      pl={'sm'}
      ref={ref}
      style={{
        backgroundColor: hovered ? 'black' : 'gray',
        cursor: 'pointer',
      }}
    >
      <Avatar src={avatar} radius='xl' size='sm' />
      <Stack spacing='xs' align='flex-start' justify='space-around'>
        <Text size='md' weight='bold'>
          {name}
        </Text>
        <Text size='xs'>{lastMessage}</Text>
      </Stack>
    </Group>
  );
};

const SidebarFriends: FC<Props> = () => {
  const { socketRef } = useChatContext();
  const [activeChat, setActiveChat] = useState();
  const [chats, setChats] = useState<Chat[]>();

  useEffect(() => {
    console.log('socketRef: ', socketRef);

    socketRef.current?.once('connect', () => {
      console.log('connected');
    });

    socketRef.current?.emit('requestRooms');

    // Get current user chats
    socketRef.current?.on('listRooms', (rooms: Chat[]) => {
      console.log(rooms);
      setChats(rooms);
    });
  }, [socketRef.current]);

  return (
    <div>
      {chats?.map((chat) => (
        <ChatItem key={chat.id} name={chat.name} avatar={null} />
      ))}
      <ChatItem name='Nelsinho' avatar={null} />
      <ChatItem name='Luizinho' avatar={null} />
      <ChatItem name='Huguinho' avatar={null} lastMessage='Hello!' />
      <ChatItem name='Jorge' avatar={null} lastMessage='Hello!' />
    </div>
  );
};

export default SidebarFriends;
