import { Flex } from '@mantine/core';
import { FCWithLayout } from '../../App';
import Pong from '../../components/Game';

const Game: FCWithLayout = () => {
  return (
    <Flex
      style={{ flex: 1 }}
      direction={{ base: 'column', sm: 'row' }}
      justify='space-around'
      align='center'
      mx={32}
      p={{ base: 32, sm: 0 }}
    >
      <Pong />
    </Flex>
  );
};

export default Game;
