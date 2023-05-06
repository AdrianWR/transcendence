import { Card, Flex, Title, Text, Space, ActionIcon, Tooltip } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { ReactNode, useEffect, useMemo } from 'react';
import Layout from '../../components/Layout';
import styles from './About.module.css';
import { FCWithLayout } from '../../App';
import { useSocket } from '../../hooks/socket';

const Home: FCWithLayout = () => {
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
        h='65vh'
        className={styles['about-card']}
      >
        <Title size={28} color='white' mb={30}>
          What is Lorem Ipsum?
        </Title>
        <Text color='white'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry standard dummy text ever since the 1500s, when an unknown printer took a
          galley of type and scrambled it to make a type specimen book.
        </Text>
        <Space h={28} />
        <Text color='white'>
          It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages.
        </Text>
        <Space h={32} />

        <Flex px={60} justify='space-between'>
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

Home.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Home;
