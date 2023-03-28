import { FC, FormEvent, useCallback, useState } from 'react';
import {
  Box,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Checkbox,
  Loader,
  Flex,
} from '@mantine/core';
import AvatarProfileUploader from '../AvatarProfileUploader';
import { useForm } from '@mantine/form';
import api from '../../../services/api';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { alert, success } from '../../Notifications';
import { IUser } from '../../../context/AuthContext';
import { AxiosError } from 'axios';

type UpdateUserFormType = Omit<IUser | undefined, 'id'> | { password?: string };

const ProfileUserForm: FC = () => {
  const { user, updateUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateUserFormType>({
    initialValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      password: '',
    },

    validate: {
      email: (value: string | undefined) =>
        /^\S+@\S+$/.test(value || '') ? null : 'Invalid email',
    },
  });

  const handleSubmit = useCallback(
    async (values: UpdateUserFormType, event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setIsLoading(true);
        const payload = { ...values };
        if (!payload.password) delete payload['password'];

        const response = await api.patch(`/users/${user?.id}`, payload);

        updateUser(response.data);
        success('User profile successfully updated!');
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) alert(err.response?.data?.message);
        else alert('Failed to update user profile');
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  return (
    <Box sx={{ maxWidth: 500, minHeight: 500 }} mx='auto'>
      {isLoading ? (
        <Flex h={450} align='center' justify='center'>
          <Loader size='xl' />
        </Flex>
      ) : (
        <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
          <Group position='center'>
            <AvatarProfileUploader />
          </Group>
          <TextInput my={3} label='Username' {...form.getInputProps('username')} />

          <TextInput my={3} label='FirstName' {...form.getInputProps('firstName')} />

          <TextInput my={3} label='LastName' {...form.getInputProps('lastName')} />

          <TextInput
            my={3}
            label='Email'
            placeholder='your@email.com'
            {...form.getInputProps('email')}
          />

          <PasswordInput
            my={3}
            label='Password'
            placeholder='Your password'
            {...form.getInputProps('password')}
          />

          <Group position='center' mt='xl'>
            <Button color='secondary' type='submit'>
              Save Changes
            </Button>
          </Group>
        </form>
      )}
    </Box>
  );
};

export default ProfileUserForm;
