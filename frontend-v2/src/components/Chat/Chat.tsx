import { ActionIcon, Drawer, Flex, Group, Modal, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessages, IconMoodPlus, IconUsers } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useChatContext } from '../../hooks/useChatContext';
import ListAllUsersCard from '../Users/ListAllUsersCard';
import ChatMembersDrawer from './ChatMembersDrawer';
import Messages from './Messages/Messages';

const AddFriendModal: FC<{ close: () => void }> = ({ close }) => {
  return <ListAllUsersCard mode='chat' close={close} />;
};

const Chat: FC = () => {
  const { activeChat } = useChatContext();
  const { user } = useAuthContext();
  const [chatName, setChatName] = useState('Chats');
  const [membersOpened, { open: membersOpen, close: membersClose }] = useDisclosure(false);
  const [addMemberOpened, { open: addMemberOpen, close: addMemberClose }] = useDisclosure(false);

  useEffect(() => {
    if (activeChat?.type === 'direct') {
      const { firstName, lastName } = activeChat?.users.find(({ id }) => id != user?.id) || {};

      setChatName(firstName ? `${firstName} ${lastName}` : 'Direct Message');
    } else {
      setChatName(activeChat?.name || 'Chats');
    }
  }, [activeChat, user]);

  return (
    <>
      <Modal opened={addMemberOpened} onClose={addMemberClose} title='Add a Friend'>
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
      <Flex direction='column' style={{ flex: 2 }}>
        <Group
          p='lg'
          h={72}
          style={{
            backgroundColor: '#2f252f',
            borderRadius: '0 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <IconMessages size={32} color='green' />
          <Text color='white' size='xl' w='fit-content' maw='20vw' truncate>
            {chatName}
          </Text>
          {activeChat?.type !== 'direct' && (
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
          )}
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
        </Group>
        <Messages />
      </Flex>
    </>
  );
};

export default Chat;
