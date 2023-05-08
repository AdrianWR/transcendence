import { Button, Container, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import styles from './404.module.css';

interface ErrorPageProps {}

const NotFoundPage: FCWithLayout<ErrorPageProps> = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigate('/');
  //   }, 10000);
  // }, [navigate]);

  return (
    <Container className={styles['not-found-container']}>
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <Stack className={styles['not-found-stack']} spacing='xl'>
          <Title>Something is not right...</Title>
          <Text color='dimmed' size='lg'>
            The page you are trying to open does not exist. You may have mistyped the address, or
            the page has been moved to another URL. If you think this is an error, contact support.
          </Text>
          <Link to='/'>
            <Button variant='filled' size='md' mt='xl'>
              Get back to home page
            </Button>
          </Link>
        </Stack>
        <Image src='/images/404.svg' alt='' />
      </SimpleGrid>
    </Container>
  );
};

export default NotFoundPage;
