import { Anchor, Button, Container, Divider, Group, Paper, PaperProps, Text } from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useRef, useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { FortyTwoButton, GoogleButton } from '../Buttons/SocialButtons';
import LoginForm from './LoginUserForm';
import RegisterForm from './RegisterUserForm';
import { TwoFactorAuthenticationForm } from './TwoFactorAuthenticationForm';

export const UserForm = (props: PaperProps) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { socialLogin, saveUser } = useLogin();
  const [isLoading, setIsLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleChange = (change: boolean) => {
    setMfaEnabled(change);
  };

  const handleSocialLogin = async (authEndpoint: string) => {
    setIsLoading(true);
    const user = await socialLogin(authEndpoint);

    if (user?.mfaEnabled) {
      setMfaEnabled(true);
    } else if (user) {
      saveUser(user);
    }

    setIsLoading(false);
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
            disabled={isLoading || mfaEnabled}
            onClick={() => {
              handleSocialLogin(`${process.env.REACT_APP_BACKEND_URL}/auth/google`);
            }}
          >
            Login with Google
          </GoogleButton>

          <FortyTwoButton
            type='button'
            disabled={isLoading || mfaEnabled}
            onClick={() => {
              handleSocialLogin(`${process.env.REACT_APP_BACKEND_URL}/auth/intra`);
            }}
          >
            Login with 42
          </FortyTwoButton>
        </Group>

        <Divider label='Or continue with your email' labelPosition='center' my='lg' />

        {type === 'register' ? (
          <RegisterForm ref={submitRef} />
        ) : (
          <LoginForm handleChange={handleChange} ref={submitRef} />
        )}

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
          <Button disabled={isLoading || mfaEnabled} onClick={() => submitRef.current?.click()}>
            {upperFirst(type)}
          </Button>
        </Group>
        {mfaEnabled && (
          <>
            <Divider my='sm' />
            <Group position='apart' mt='xl'>
              <TwoFactorAuthenticationForm />
            </Group>
          </>
        )}
      </Paper>
    </Container>
  );
};
