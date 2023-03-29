import { Container, Text } from '@mantine/core';
import { useEffect } from 'react';
import { FCWithLayout } from '../../App';
import { useAuthContext } from '../../hooks/useAuthContext';

const LoginSuccess: FCWithLayout = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <Container>
      <Text>Thanks for logging in {user?.mfaEnabled}! You will be redirected soon...</Text>
    </Container>
  );
};

export default LoginSuccess;
