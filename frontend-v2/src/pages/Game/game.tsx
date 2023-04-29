import { Flex } from '@mantine/core';
import { FCWithLayout } from '../../App';
import GameCanvas from '../../components/Game/Canvas';

const GamePage: FCWithLayout = () => {
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
