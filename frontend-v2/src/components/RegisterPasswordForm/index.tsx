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
    <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values.password, event))}>
      <Stack align='center' w='100%'>
        <PasswordInput
          w='100%'
          withAsterisk
          label='Password'
          placeholder='Your password'
          required
          {...form.getInputProps('password')}
        />

        <PasswordInput
          w='100%'
          withAsterisk
          label='Confirm Password'
          placeholder='Your password'
          required
          {...form.getInputProps('confirmPassword')}
        />
        <Button w='50%' type='submit'>
          Change Password
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterPasswordForm;
