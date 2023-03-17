import { Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { FormEvent, forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateUserDto, useSignUp } from '../../hooks/useSignUp';
import { alert, success } from '../Notifications';

type RegisterUserFormType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterForm = forwardRef<HTMLButtonElement>((_props, ref) => {
  const { signUp, error } = useSignUp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

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

  const handleSubmit = async (values: RegisterUserFormType, e: FormEvent) => {
    e.preventDefault();

    const createUserDto: CreateUserDto = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    };

    await signUp(createUserDto);

    if (error) {
      alert(error);
    } else {
      success('Your user was registered successfully.');
      navigate(from, { replace: true });
    }
  };

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
      <button type='submit' ref={ref} style={{ display: 'none' }} />
    </form>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
