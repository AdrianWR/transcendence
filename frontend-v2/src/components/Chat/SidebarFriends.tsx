import { Avatar, Box, DefaultProps, Flex, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { IChat } from '../../context/ChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';

interface ChatItemProps extends DefaultProps {
  chat: IChat;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { user } = useAuthContext();
  const { hovered, ref } = useHover();
  const { activeChat, setActiveChat } = useChatContext();
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    if (chat.type === 'direct') {
      const { firstName, lastName } = chat.users.find(({ id }) => id != user?.id) || {};

      setChatName(firstName ? `${firstName} ${lastName}` : 'Direct Message');
    } else {
      setChatName(chat.name);
    }
  }, [chat, user]);

  return (
    <UnstyledButton
      onClick={() => setActiveChat(chat)}
      style={{
        width: '98%',
        margin: '8px 0',
      }}
    >
      <Group
        py={'xs'}
        pl={'sm'}
        ref={ref}
        style={{
          backgroundColor: hovered || activeChat?.id === chat.id ? 'black' : 'transparent',
          cursor: 'pointer',
          borderRadius: 4,
          border: hovered ? '1px solid rgba(244, 96, 54, 1)' : '1px solid transparent',
        }}
      >
        <Avatar src={chat.avatar} radius='xl' size='sm' />
        <Stack spacing='xs' align='flex-start' justify='space-around'>
          <Text size='md' weight='bold'>
            {chatName}
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
    <Flex
      direction='column'
      align='center'
      bg='lightBlack'
      h='100%'
      className='custom-scroll-bar'
      style={{ borderRadius: '0 0 0 10px', overflow: 'auto' }}
    >
      {chats?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </Flex>
  );
};

export default SidebarFriends;
