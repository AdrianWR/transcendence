import { Card, Flex, Image, Text, Title } from '@mantine/core';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import Layout from '../../components/Layout';
import styles from './Home.module.css';

const Home: FCWithLayout = () => {
  return (
    <Flex
      style={{ flex: 1 }}
      direction={{ base: 'column', sm: 'row' }}
      justify='space-around'
      align='center'
      mx={32}
      p={{ base: 32, sm: 0 }}
    >
      <Card
        w={{ base: '90%', sm: '45%', lg: '35%' }}
        shadow='xl'
        h='65vh'
        className={styles['game-card']}
      >
        <Link to='/game'>
          <Title color='white' mb='xl'>
            Game
          </Title>
          <Image
            src='/images/home-game-vector.svg'
            alt='game controller vector'
            maw={210}
            mx='auto'
            my={48}
          />
          <Text color='white' size='xl'>
            Ready for some fun? Click here to play our awesome game! Play against other players,
            create your own room and invite your friends to play with you!
          </Text>
        </Link>
      </Card>

      <Card
        w={{ base: '90%', sm: '45%', lg: '35%' }}
        mt={{ base: 32, sm: 0 }}
        shadow='xl'
        h='65vh'
        className={styles['chat-card']}
      >
        <Link to='/chat'>
          <Title color='lightBlack' mb='xl'>
            Chat
          </Title>
          <Image
            src='/images/home-chat-vector.svg'
            alt='chat ballon vector'
            maw={150}
            mx='auto'
            my={36}
          />
          <Text color='lightBlack' size='xl'>
            Click here to chat with other players! You can talk about the game, gossip, ask for
            help, or just have a nice conversation!
          </Text>
        </Link>
      </Card>
    </Flex>
  );
};

Home.getLayout = function getLayout(page: ReactNode) {
  return <Layout imageSrc='/images/cosmic-cliffs.png'>{page}</Layout>;
};

export default Home;
