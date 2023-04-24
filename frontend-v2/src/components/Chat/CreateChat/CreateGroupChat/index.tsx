import { Button, Radio, Stack, Text, TextInput } from '@mantine/core';
import { FC, useCallback, useState } from 'react';
import { IChatType, ICreateChatDto } from '../../../../context/ChatContext';
import { useChatContext } from '../../../../hooks/useChatContext';
import styles from './CreateGroupChat.module.css';

interface IGroupChatModalProps {
  close(): void;
}

const GroupChatCreateModal: FC<IGroupChatModalProps> = ({ close }) => {
  const { createGroupChat } = useChatContext();
  const [chat, setChat] = useState<ICreateChatDto>({
    name: '',
    type: 'public',
  });

  const emitCreateGrouChat = useCallback(
    async (createChatDto: ICreateChatDto) => {
      createGroupChat(createChatDto);
      close();
    },
    [createGroupChat],
  );

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
          setChat((chat) => ({ ...chat, type: value as IChatType }));
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
        onClick={() => emitCreateGrouChat(chat)}
        disabled={!chat.name || (chat.type === 'protected' && !chat.password)}
        className={styles['create-group-chat-button']}
      >
        Create Chat
      </Button>
    </Stack>
  );
};

export default GroupChatCreateModal;
