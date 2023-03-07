import { Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AxiosError, HttpStatusCode } from 'axios';
import { FormEvent } from 'react';
import api from '../../services/api';

type RegisterUserFormType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type CreateUserDto = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

interface RegisterFormProps {
  submitRef: () => object;
}

const alertNotification = (title: string, message: string) => {
  showNotification({
    title: title,
    message: message,
    color: 'red',
    icon: <IconX />,
  });
};

const successNotification = (title: string, message: string) => {
  showNotification({
    title: title,
    message: message,
    color: 'green',
    icon: <IconCheck />,
  });
};

const handleSubmit = async (values: RegisterUserFormType, event: FormEvent) => {
  event.preventDefault();
  const registerUri = '/auth/local/signup';
  const payload: CreateUserDto = {
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
    password: values.password,
  };

  console.log(payload);

  try {
    await api.post(registerUri, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    successNotification('Success!', 'Your user was registered successfully.');
  } catch (err) {
    if (err instanceof AxiosError) {
      if (!err?.response) {
        alertNotification('No Server Response', 'Please try again in a few seconds.');
      } else if (err.response?.status === HttpStatusCode.Conflict) {
        alertNotification('Email already registered', 'Please log in to your account.');
      } else {
        alertNotification('Registration failed', 'Please try again in a few seconds.');
        console.error(err.response);
      }
    } else {
      alertNotification('Registration failed', 'Please try again in a few seconds.');
      console.error(err);
    }
  }
};

export const RegisterUserForm = ({ submitRef }: RegisterFormProps) => {
  const form = useForm<RegisterUserFormType>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: isEmail('Invalid email'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },

    validateInputOnChange: true,
  });

  return (
    <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
      <Stack>
        <Group position='center' spacing='xs' grow={true}>
          <TextInput
            withAsterisk
            label='First Name'
            placeholder=''
            {...form.getInputProps('firstName')}
          />

          <TextInput
            withAsterisk
            label='Last Name'
            placeholder=''
            {...form.getInputProps('lastName')}
          />
        </Group>

        <TextInput
          withAsterisk
          label='Email'
          placeholder='your@email.com'
          {...form.getInputProps('email')}
        />

        <PasswordInput
          withAsterisk
          label='Password'
          placeholder='Your password'
          required
          {...form.getInputProps('password')}
        />

        <PasswordInput
          withAsterisk
          label='Confirm Password'
          placeholder='Your password'
          required
          {...form.getInputProps('confirmPassword')}
        />
      </Stack>
      <button ref={submitRef} type='submit' style={{ display: 'none' }} />
    </form>
  );
};

export default { RegisterUserForm };
