import { Avatar, DefaultProps, Group, Text } from '@mantine/core';
import { FC } from 'react';
import Message from './Message';

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
      <Message />
    </div>
  );
};

export default Chat;
