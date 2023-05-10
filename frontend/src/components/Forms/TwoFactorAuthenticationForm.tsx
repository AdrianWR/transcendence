import { Button, Container, Group, Paper, PinInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC, FormEvent } from 'react';
import { TwoFactorAuthenticationDto, useLogin } from '../../hooks/useLogin';

export const TwoFactorAuthenticationForm: FC = (props) => {
  const { login2fa } = useLogin();

  const form = useForm<TwoFactorAuthenticationDto>({
    initialValues: {
      code: '',
    },

    validate: {
      code: (value) => (value.length < 6 ? 'Fill up all the code digits' : null),
    },
  });

  const handleSubmit = async (code: TwoFactorAuthenticationDto, event: FormEvent) => {
    event.preventDefault();

    await login2fa(code);
  };

  return (
    <Container size='xl'>
      <Paper radius='md' p='xl' withBorder {...props}>
        <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
          <Stack>
            <Text>Insert here your 2FA Token</Text>
            <Group>
              <PinInput length={6} type='number' oneTimeCode {...form.getInputProps('code')} />
            </Group>
            <Button type='submit'>Authenticate</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
