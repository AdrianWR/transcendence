import { Flex } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import { UserForm } from '../../components/forms/UserForm';
import { useAuthContext } from '../../hooks/useAuthContext';

const Login: FCWithLayout = () => {
  const { user } = useAuthContext();

  return !user ? (
    <Flex align='center' justify='center' style={{ flex: 1 }}>
      <UserForm w={500} />
    </Flex>
  ) : (
    <Navigate to='/' />
  );
};

export default Login;
