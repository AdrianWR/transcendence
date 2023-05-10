import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowBadgeRight,
  IconBan,
  IconHeartHandshake,
  IconMessage2Off,
  IconMessages,
  IconMoodPlus,
  IconSettings,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IChatUser } from '../../context/ChatContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import api from '../../services/api';
import { alert, success } from '../Notifications';
import UserAvatar from '../UserAvatar';
import ChatMembersDrawer from './ChatMembersDrawer';
import ChatSettingsModal from './ChatSettingsModal';
import ListAllUsersCard from './ListUsersModal';
import Messages from './Messages/Messages';

const AddFriendModal: FC<{ close: () => void }> = ({ close }) => {
  return <ListAllUsersCard mode='chat' close={close} />;
};

interface BlockButtonProps {
  friend: IChatUser;
}

const BlockButton: FC<BlockButtonProps> = ({ friend }) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const notificationTitle = 'Friends';
  const [isLoading, setIsLoading] = useState(false);
  const { updateFriendListChats } = useChatContext();

  const handleBlockFriend = useCallback(async (friend: IChatUser) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/chats/${friend.id}/block`);
      success('Successfully blocked friend');
      updateFriendListChats(data.user.id);
    } catch (err) {
      if (err instanceof AxiosError) alert(err.response?.data.message, notificationTitle);
      else alert('Something went wrong while trying to block friend', notificationTitle);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUnblockFriend = useCallback(async (friend: IChatUser) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/chats/${friend.id}/unblock`);
      success('Successfully unblocked friend');
      updateFriendListChats(data.user.id);
    } catch (err) {
      if (err instanceof AxiosError) alert(err.response?.data.message, notificationTitle);
      else alert('Something went wrong while trying to unblock friend', notificationTitle);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingOverlay
        loaderProps={{ color: 'secondary', size: 'sm' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={2}
      />
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton
        centered
        size={340}
        title='Block friend'
      >
        <LoadingOverlay
          loaderProps={{ color: 'secondary' }}
          overlayOpacity={0.2}
          visible={isLoading}
          overlayBlur={1}
        />
        <Text>
          Are you sure you want to block{' '}
          <Text span color='red' weight='bolder'>
            {friend.username}
          </Text>
          ?
        </Text>
        <Text mt={6} size='xs' italic>
          You will not be able to send or receive DMs from each other and will not see each other
          messages on public/private chats. Later you can unblock if you make peace :)
        </Text>
        <Flex justify='space-between' mt='md' gap='md'>
          <Button
            leftIcon={<IconBan />}
            variant='outline'
            color='red'
            size='sm'
            fullWidth
            onClick={() => {
              handleBlockFriend(friend);
              close();
            }}
          >
            BLock
          </Button>
          <Button
            leftIcon={<IconX />}
            variant='outline'
            color='gray'
            size='sm'
            fullWidth
            onClick={close}
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
      {friend.status === 'active' ? (
        <Tooltip label='Block'>
          <ActionIcon variant='filled' color='red' radius='xl' size='lg' onClick={toggle}>
            <IconMessage2Off />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Tooltip label='Unblock'>
          <ActionIcon
            variant='filled'
            color='lightBlue'
            radius='xl'
            size='lg'
            onClick={() => handleUnblockFriend(friend)}
          >
            <IconHeartHandshake />
          </ActionIcon>
        </Tooltip>
      )}
    </Box>
  );
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

  const dmFriend = useMemo(() => {
    if (activeChat?.type === 'direct') {
      return activeChat.users.find(({ id }) => id !== user?.id);
    }
    return null;
  }, [activeChat, user]);

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
            {dmFriend ? (
              <UserAvatar user={dmFriend} size='md' />
            ) : (
              // <Avatar src={dmFriend?.avatarUrl} radius='xl' size={36} />
              <IconMessages size={32} color='green' />
            )}
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
            {activeChat?.type === 'direct' && (
              <BlockButton
                friend={activeChat?.users.find(({ id }) => id !== user?.id) || ({} as IChatUser)}
              />
            )}
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
