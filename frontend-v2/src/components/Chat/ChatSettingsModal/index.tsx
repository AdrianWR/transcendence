import { Button, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC, FormEvent } from 'react';
import { useSocket } from '../../../hooks/socket';
import { useChatContext } from '../../../hooks/useChatContext';
import { alert, success } from '../../Notifications';

type ChangePasswordFormType = {
  password: string;
  confirmPassword: string;
};

type ChatSettingsModalProps = {
  close(): void;
};

export const ChatSettingsModal: FC<ChatSettingsModalProps> = ({ close }) => {
  const { socket } = useSocket();
  const { activeChat } = useChatContext();

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

  const handleSubmit = async (values: ChangePasswordFormType, e: FormEvent) => {
    e.preventDefault();

    socket?.emit(
      'updateChat',
      {
        id: activeChat?.id,
        password: values.password,
      },
      (error: string) => {
        if (error) {
          alert(error, 'Chat Settings');
        } else {
          success('Your password was updated successfully.', 'Chat Settings');
          close();
        }
      },
    );
  };

  return (
    <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
      <Stack>
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
      <Button type='submit'>Change Password</Button>
    </form>
  );
};

export default ChatSettingsModal;
