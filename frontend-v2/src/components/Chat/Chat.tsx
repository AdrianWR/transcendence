import { Avatar, DefaultProps, Group, Text } from '@mantine/core';
import { FC } from 'react';
import Messages from './Messages/Messages';

// interface ChatProps extends DefaultProps {}

const Chat: FC<DefaultProps> = ({ className }) => {
  return (
    <div className={className}>
      <Group p='lg' style={{ backgroundColor: '#2f252f', height: '30%' }}>
        <Avatar radius='xl' size='md' color='green' />
        <Text color='white' size='xl'>
          Chats
        </Text>
      </Group>
      <Messages />
    </div>
  );
};

export default Chat;
