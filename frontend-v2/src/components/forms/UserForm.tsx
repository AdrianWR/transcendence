import { Anchor, Button, Container, Divider, Group, Paper, PaperProps, Text } from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocialLogin } from '../../hooks/useSocialLogin';
import { FortyTwoButton, GoogleButton } from '../buttons/SocialButtons';
import { success } from '../Notifications';
import LoginForm from './LoginUserForm';
import RegisterForm from './RegisterUserForm';

export const UserForm = (props: PaperProps) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { socialLogin, error, isLoading } = useSocialLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSocialLogin = async (authEndpoint: string) => {
    await socialLogin(authEndpoint);

    if (error) {
      alert(error);
    } else {
      success('Your user was logged in successfully!');
      navigate(from, { replace: true });
    }
  };

  return (
    <Container>
      <Paper radius='md' p='md' withBorder {...props}>
        <Text align='center' size='lg' weight={500}>
          Welcome to Transcendence, {type} with
        </Text>

        <Group position='center' mt='md'>
          <GoogleButton
            type='button'
            disabled={isLoading}
            onClick={() => {
              handleSocialLogin('http://localhost:8080/auth/google');
            }}
          >
            Login with Google
          </GoogleButton>

          {/* <Link
            to='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-aee1e21b925b5f31e7fa53ba727f9d23985886fa9a4d88ba3ab6f55d4bdb9ca7&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fintra%2Fredirect&response_type=code'
            target='_blank'
          > */}
          <FortyTwoButton
            type='button'
            disabled={isLoading}
            onClick={() => {
              handleSocialLogin('http://localhost:8080/auth/intra');
            }}
          >
            Login with 42
          </FortyTwoButton>
          {/* </Link> */}
        </Group>

        <Divider label='Or continue with your email' labelPosition='center' my='lg' />

        {type === 'register' ? <RegisterForm ref={submitRef} /> : <LoginForm ref={submitRef} />}

        <Group position='apart' mt='xl'>
          <Anchor
            component='button'
            type='button'
            color='dimmed'
            onClick={() => toggle()}
            size='xs'
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : 'Do not have an account? Register'}
          </Anchor>
          <Button onClick={() => submitRef.current!.click()}>{upperFirst(type)}</Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default UserForm;
