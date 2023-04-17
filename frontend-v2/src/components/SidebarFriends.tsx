import { Avatar, DefaultProps, Group, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC } from 'react';

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

const SidebarFriends: FC<DefaultProps> = () => {
  return (
    <div>
      <ChatItem name='Nelsinho' avatar={null} />
      <ChatItem name='Luizinho' avatar={null} />
      <ChatItem name='Huguinho' avatar={null} lastMessage='Hello!' />
      <ChatItem name='Jorge' avatar={null} lastMessage='Hello!' />
    </div>
  );
};

export default SidebarFriends;
