import { Card, Flex, Title, Text, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import Layout from '../../components/Layout';
import styles from './Home.module.css';
import { FCWithLayout } from '../../App';

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
          <Text color='white'>
            Dolore sint sint duis minim. Eu nostrud incididunt culpa aute dolore ea tempor est ad
            adipisicing occaecat dolor amet aliqua. Irure aliquip elit amet aliquip commodo sint
            dolor. Deserunt laborum cupidatat irure ea exercitation reprehenderit labore.
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
          <Text color='lightBlack'>
            Qui irure exercitation nulla in ex eu amet amet elit deserunt sint. Commodo id ad dolor
            velit dolor irure ex officia aute non non incididunt aute laboris. Irure quis culpa duis
            ullamco. Sunt ullamco sint exercitation excepteur laboris nisi dolor qui adipisicing
            aute ad. Laboris esse tempor ea pariatur eu culpa eu sunt dolore.
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
