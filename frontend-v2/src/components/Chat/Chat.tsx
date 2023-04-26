import {
  ActionIcon,
  Badge,
  Drawer,
  Flex,
  Group,
  Modal,
  PasswordInput,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowBadgeRight,
  IconMessages,
  IconMoodPlus,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSocket } from '../../hooks/socket';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import ListAllUsersCard from '../Users/ListAllUsersCard';
import ChatMembersDrawer from './ChatMembersDrawer';
import ChatSettingsModal from './ChatSettingsModal';
import Messages from './Messages/Messages';

const AddFriendModal: FC<{ close: () => void }> = ({ close }) => {
  return <ListAllUsersCard mode='chat' close={close} />;
};

const Chat: FC = () => {
  const { activeChat, isBlocked, setIsBlocked, authenticateChat, protectedChats } =
    useChatContext();
  const { user } = useAuthContext();
  const [chatName, setChatName] = useState('Chats');
  const [password, setPassword] = useState('');
  const [membersOpened, { open: membersOpen, close: membersClose }] = useDisclosure(false);
  const [addMemberOpened, { open: addMemberOpen, close: addMemberClose }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (activeChat?.type === 'direct') {
      const { firstName, lastName } = activeChat?.users.find(({ id }) => id != user?.id) || {};

      setChatName(firstName ? `${firstName} ${lastName}` : 'Direct Message');
    } else {
      setChatName(activeChat?.name || 'Chats');
    }

    if (
      activeChat?.type === 'protected' &&
      protectedChats.find((chat) => chat.id === activeChat.id)
    ) {
      setIsBlocked(true);
    }

    setPassword('');
  }, [activeChat, user]);

  const getChatTypeBadge = useCallback(() => {
    const type = activeChat?.type;

    switch (type) {
      case 'public':
        return <Badge color='green'>Public</Badge>;
      case 'private':
        return <Badge color='yellow'>Private</Badge>;
      case 'protected':
        return (
          <Flex align='center' gap='sm'>
            <Badge color='red'>Protected</Badge>
            {isBlocked && (
              <>
                <PasswordInput
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  placeholder='Insert the chat password'
                  w={200}
                />
                <ActionIcon
                  variant='filled'
                  color='red'
                  radius='xl'
                  size='lg'
                  onClick={() => {
                    authenticateChat(password);
                    setPassword('');
                  }}
                >
                  <IconArrowBadgeRight size={24} />
                </ActionIcon>
              </>
            )}
          </Flex>
        );
      default:
        return;
    }
  }, [activeChat, isBlocked, password, authenticateChat]);

  return (
    <>
      <Modal opened={addMemberOpened} onClose={addMemberClose} title='Add a Member'>
        <AddFriendModal close={addMemberClose} />
      </Modal>
      <Drawer
        position='right'
        size='lg'
        opened={membersOpened}
        onClose={membersClose}
        title='Chat Members'
      >
        <ChatMembersDrawer close={membersClose} />
      </Drawer>

      <Modal opened={editOpened} onClose={editClose} title='Edit Chat'>
        <ChatSettingsModal close={editClose} />
      </Modal>

      <Flex direction='column' style={{ flex: 2 }}>
        <Group
          p='lg'
          h={72}
          style={{
            backgroundColor: '#2f252f',
            borderRadius: '0 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Flex align='center' gap='sm'>
            <IconMessages size={32} color='green' />
            <Text color='white' size='xl' w='fit-content' maw='20vw' truncate>
              {chatName}
            </Text>
            {activeChat?.type !== 'direct' && (
              <div hidden={!activeChat}>
                <Tooltip label='Add a member' position='top-start'>
                  <ActionIcon
                    variant='filled'
                    color='lightBlue'
                    radius='xl'
                    size='lg'
                    onClick={() => {
                      addMemberOpen();
                    }}
                  >
                    <IconMoodPlus />
                  </ActionIcon>
                </Tooltip>
              </div>
            )}
            <div hidden={!activeChat}>
              <Tooltip label='Members' position='top-start'>
                <ActionIcon
                  variant='filled'
                  color='secondary'
                  radius='xl'
                  size='lg'
                  onClick={() => {
                    membersOpen();
                  }}
                >
                  <IconUsers />
                </ActionIcon>
              </Tooltip>
            </div>
            {activeChat?.users.find(({ id }) => id === user?.id)?.role === 'owner' &&
              activeChat?.type === 'protected' && (
                <Tooltip label='Edit' position='top-start'>
                  <ActionIcon
                    variant='filled'
                    color='lightBlack'
                    radius='xl'
                    size='lg'
                    onClick={() => {
                      editOpen();
                    }}
                  >
                    <IconSettings />
                  </ActionIcon>
                </Tooltip>
              )}
          </Flex>
          {getChatTypeBadge()}
        </Group>
        <Messages />
      </Flex>
    </>
  );
};

export default Chat;
