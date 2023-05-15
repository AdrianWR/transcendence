import { Button, Container, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import Layout from '../../components/Layout';
import styles from './404.module.css';

interface ErrorPageProps {}

const NotFoundPage: FCWithLayout<ErrorPageProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate('/');
    }, 12000);

    return () => clearTimeout(redirect);
  }, [navigate]);

  return (
    <Container className={styles['not-found-container']}>
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <Image src='/images/404.svg' alt='' />
        <Stack className={styles['not-found-stack']} spacing='xl'>
          <Title color='lightBlack' align='center' order={2}>
            Something is not right...
          </Title>
          <Text color='lightBlack' size='lg' align='center'>
            The page you are trying to open does not exist. You may have mistyped the address, or
            the page has been moved to another URL. If you think this is an error, contact support.
          </Text>
          <Link to='/'>
            <Button variant='filled' size='md' mt='xl'>
              Get back to home page
            </Button>
          </Link>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

NotFoundPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout imageSrc='/images/southern-ring-nebula.png'>{page}</Layout>;
};

export default NotFoundPage;
