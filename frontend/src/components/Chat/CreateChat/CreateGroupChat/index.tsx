import { Button, PasswordInput, Radio, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC, FormEvent } from 'react';
import { ICreateChatDto } from '../../../../context/ChatContext';
import { useChatContext } from '../../../../hooks/useChatContext';
import styles from './CreateGroupChat.module.css';

interface IGroupChatModalProps {
  close(): void;
}

interface ICreateChatForm {
  name: string;
  type: string;
  password: string;
  confirmPassword: string;
}

const GroupChatCreateModal: FC<IGroupChatModalProps> = ({ close }) => {
  const { createGroupChat } = useChatContext();

  const handleSubmit = async (values: ICreateChatForm, event: FormEvent) => {
    event.preventDefault();
    createGroupChat(values as ICreateChatDto);
    close();
  };

  const form = useForm({
    initialValues: {
      name: '',
      type: 'public',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (value) => (value.length < 3 ? 'Chat name must be at least 3 characters' : null),
      password: (value) => (value.length < 3 ? 'Password must be at least 3 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },

    validateInputOnChange: true,
  });

  return (
    <form
      className={styles['create-group-chat-form']}
      onSubmit={(event) => handleSubmit(form.values, event)}
      // onSubmit={form.onSubmit((values, event) => handleSubmit(values, event))}
    >
      <TextInput
        withAsterisk
        name='chat-name'
        label='Chat Name'
        className={styles['create-group-chat-input']}
        {...form.getInputProps('name')}
      />

      <Radio.Group
        name='chat-type'
        label='Chat Type'
        defaultValue='public'
        className={styles['create-group-chat-radio-group']}
        {...form.getInputProps('type')}
      >
        <Radio value='public' label='Public' className={styles['create-group-chat-radio-button']} />
        <Radio
          value='private'
          label='Private'
          className={styles['create-group-chat-radio-button']}
        />
        <Radio
          value='protected'
          label='Protected By Password'
          className={styles['create-group-chat-radio-button']}
        />
      </Radio.Group>

      <PasswordInput
        withAsterisk
        name='password'
        label='Password'
        className={styles['create-group-chat-input']}
        style={{
          display: form.values.type === 'protected' ? 'block' : 'none',
        }}
        {...form.getInputProps('password')}
      />

      <PasswordInput
        withAsterisk
        name='confirm-password'
        label='Confirm Password'
        className={styles['create-group-chat-input']}
        style={{
          display: form.values.type === 'protected' ? 'block' : 'none',
        }}
        {...form.getInputProps('confirmPassword')}
      />

      <Button
        name='create-chat-button'
        variant='filled'
        type='submit'
        disabled={!form.values.name || (form.values.type === 'protected' && !form.values.password)}
        className={styles['create-group-chat-button']}
      >
        Create Chat
      </Button>
    </form>
  );
};

export default GroupChatCreateModal;
