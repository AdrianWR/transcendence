import { Flex, Title } from '@mantine/core';
import { FC, FormEvent, useState } from 'react';
import { useSocket } from '../../../hooks/socket';
import { useChatContext } from '../../../hooks/useChatContext';
import { alert, success } from '../../Notifications';
import RegisterPasswordForm from '../../RegisterPasswordForm';

type ChatSettingsModalProps = {
  close: () => void;
};

const ChatSettingsModal: FC<ChatSettingsModalProps> = ({ close }) => {
  const { socket } = useSocket();
  const { activeChat } = useChatContext();
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (password: string, e: FormEvent) => {
    e.preventDefault();

    socket?.emit(
      'updateChat',
      {
        id: activeChat?.id,
        password: password,
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
    <Flex direction='column' align='center' justify='space-between'>
      <Title
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        Change Password
      </Title>
      <RegisterPasswordForm
        handleSubmit={(password: string, e: FormEvent) => handleSubmit(password, e)}
      />
    </Flex>
  );
};

export default ChatSettingsModal;
