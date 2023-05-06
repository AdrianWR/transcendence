import { Flex } from '@mantine/core';
import { FCWithLayout } from '../../App';
import GameCanvas from '../../components/Game/Canvas';
import { useEffect } from 'react';
import { useSocket } from '../../hooks/socket';

const GamePage: FCWithLayout = () => {
  const { socket, updateSocketUserStatus } = useSocket();
  useEffect(() => {
    if (socket) updateSocketUserStatus('game');
  }, [socket]);
  return (
    <Flex
      style={{ flex: 1 }}
      direction={{ base: 'column', sm: 'row' }}
      justify='space-around'
      align='center'
      mx={32}
      p={{ base: 32, sm: 0 }}
    >
      <GameCanvas />
    </Flex>
  );
};

export default GamePage;
