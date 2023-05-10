import { ActionIcon, Card, Flex, Text, Title, Tooltip } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { ReactNode, useEffect, useMemo } from 'react';
import { FCWithLayout } from '../../App';
import Layout from '../../components/Layout';
import { useSocket } from '../../hooks/socket';
import styles from './About.module.css';

const About: FCWithLayout = () => {
  const devs = useMemo(
    () => [
      { name: 'lniehues | Lucas Farias', githubUrl: 'https://github.com/lucasnfarias' },
      { name: 'aroque | Adrian Roque', githubUrl: 'https://github.com/AdrianWR' },
      { name: 'pcunha | Paulo Cunha', githubUrl: 'https://github.com/PCC19' },
      { name: 'rdutenke | Raphael Dutenkefer', githubUrl: 'https://github.com/dutenrapha' },
      { name: 'aprotoce | Alexei Koslovsky', githubUrl: 'https://github.com/alexeipk' },
    ],
    [],
  );

  const { socket, updateSocketUserStatus } = useSocket();

  useEffect(() => {
    if (socket) updateSocketUserStatus('online');
  }, [socket]);

  return (
    <Flex style={{ flex: 1 }} align='center' justify='center' p={{ base: 32, sm: 0 }}>
      <Card
        w={{ base: '90%', sm: '45%', lg: '35%' }}
        shadow='xl'
        // h='68vh'
        className={styles['about-card']}
      >
        <Title size={28} color='white' mb={30}>
          Welcome to our Transcendence!
        </Title>
        <Flex direction='column' gap={30}>
          <Text color='white'>
            Transcendence is the final frontier of the 42 cursus. It is a 3+ week project where
            students are challenged to create a multiplayer game using the technologies they have
            learned during the cursus.
          </Text>
          <Text color='white'>
            The project is divided into 3 parts: the game itself, a chat application and a user
            profile page. The game consists in a Pong clone, where players can join a room and play
            against each other; the chat application is a simple chat room where users can talk to
            each other, and the user profile page is where users can see their stats and
            achievements.
          </Text>
          <Text color='white'>
            Our frontend app was built using React and Typescript; the backend was built using the
            Nest.js framework, and the database is a PostgreSQL database. To launch the app, we also
            provide a docker-compose.yml file, which will launch the frontend, backend and database
            containers.
          </Text>
          <Text color='white'>
            This project was created by a group of 5 students from the 42 São Paulo campus. We hope
            you enjoy it!
          </Text>
        </Flex>
        <Flex px={60} justify='space-between' mt='xl'>
          {devs.map(({ name, githubUrl }, index) => (
            <Tooltip key={`${name}${index}`} label={name} withArrow color='secondary'>
              <ActionIcon
                variant='outline'
                size='lg'
                radius='lg'
                color='secondary'
                component='a'
                href={githubUrl}
                target='_blank'
              >
                <IconBrandGithub size='1.5rem' />
              </ActionIcon>
            </Tooltip>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};

About.getLayout = function getLayout(page: ReactNode) {
  return <Layout imageSrc='/images/southern-ring-nebula-miri.png'>{page}</Layout>;
};

export default About;
