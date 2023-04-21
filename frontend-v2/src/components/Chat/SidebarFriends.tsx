import { Avatar, DefaultProps, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC, PropsWithChildren } from 'react';
import { IChat } from '../../context/ChatContext';
import { useChatContext } from '../../hooks/useChatContext';

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
  const { chats } = useChatContext();

  return (
    <div>
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default SidebarFriends;
