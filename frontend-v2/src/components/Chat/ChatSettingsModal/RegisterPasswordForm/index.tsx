import { Button, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC, FormEvent } from 'react';

type ChangePasswordFormType = {
  password: string;
  confirmPassword: string;
};

type RegisterPasswordFormProps = {
  handleSubmit: (password: string, e: FormEvent) => void;
};

const RegisterPasswordForm: FC<RegisterPasswordFormProps> = ({ handleSubmit }) => {
  const form = useForm<ChangePasswordFormType>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (value) => (value.length < 3 ? 'Password must be at least 3 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },

    validateInputOnChange: true,
  });

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={form.onSubmit(async (values, event) => handleSubmit(values.password, event))}
    >
      <Stack align='center' spacing='md'>
        <PasswordInput
          withAsterisk
          label='Password'
          placeholder='Your password'
          required
          w='100%'
          {...form.getInputProps('password')}
        />

        <PasswordInput
          withAsterisk
          label='Confirm Password'
          placeholder='Your password'
          required
          w='100%'
          {...form.getInputProps('confirmPassword')}
        />
        <Button type='submit'>Change Password</Button>
      </Stack>
    </form>
  );
};

export default RegisterPasswordForm;
