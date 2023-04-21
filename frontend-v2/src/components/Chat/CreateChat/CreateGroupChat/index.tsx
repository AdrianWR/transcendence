import { Button, Radio, Stack, Text, TextInput } from '@mantine/core';
import { FC, PropsWithChildren, useState } from 'react';
import { useSocket } from '../../../../hooks/socket';
import styles from './CreateGroupChat.module.css';

// interface ICreateGroupChatProps extends PropsWithChildren<{}> {
//   onSubmit: (chat: CreateChatDto) => void
// }

type ChatType = 'public' | 'private' | 'protected';

type CreateChatDto = {
  name: string;
  type: ChatType;
  password?: string;
};

const CreateGroupChatComponent: FC<PropsWithChildren> = () => {
  const { socket } = useSocket();
  const [chat, setChat] = useState<CreateChatDto>({
    name: '',
    type: 'public',
  });

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(chat);

    socket?.emit('createChat', chat);
  };

  return (
    <Stack className={styles['create-group-chat']}>
      <Text className={styles['create-group-chat-label']}>Chat Name</Text>
      <TextInput
        withAsterisk
        className={styles['create-group-chat-input']}
        onChange={(event) => {
          setChat((chat) => ({ ...chat, name: event.target.value }));
        }}
      />

      <Text className={styles['create-group-chat-label']}>Chat Type</Text>
      <Radio.Group
        name='chat-type'
        defaultValue='public'
        onChange={(value) => {
          setChat((chat) => ({ ...chat, type: value as ChatType }));
        }}
        className={styles['create-group-chat-radio-group']}
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

      <div hidden={chat.type !== 'protected'} style={{ justifyContent: 'center' }}>
        <Text className={styles['create-group-chat-label']}>Chat Password</Text>
        <TextInput
          onChange={(event) => {
            setChat((chat) => ({ ...chat, password: event.target.value }));
          }}
          className={styles['create-group-chat-input']}
        />
      </div>

      <Button
        variant='filled'
        onClick={handleSubmit}
        disabled={!chat.name || (chat.type === 'protected' && !chat.password)}
        className={styles['create-group-chat-button']}
      >
        Create Chat
      </Button>
    </Stack>
  );
};

export default CreateGroupChatComponent;
