import { Avatar, Flex, Group, Text } from '@mantine/core';
import { IconMessages } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import Messages from './Messages/Messages';

const Chat: FC = () => {
  const { activeChat } = useChatContext();
  const { user } = useAuthContext();
  const [chatName, setChatName] = useState('Chats');

  useEffect(() => {
    if (activeChat?.type === 'direct') {
      const { firstName, lastName } = activeChat?.users.find(({ id }) => id != user?.id) || {};

      setChatName(firstName ? `${firstName} ${lastName}` : 'Direct Message');
    } else {
      setChatName(activeChat?.name || 'Chats');
    }
  }, [activeChat, user]);

  return (
    <Flex direction='column' style={{ flex: 2 }}>
      <Group p='lg' h={72} style={{ backgroundColor: '#2f252f', borderRadius: '0 10px 0 0' }}>
        <IconMessages size={32} color='green' />
        <Text color='white' size='xl'>
          {chatName}
        </Text>
      </Group>
      <Messages />
    </Flex>
  );
};

export default Chat;
