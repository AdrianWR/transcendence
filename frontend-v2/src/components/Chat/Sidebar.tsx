import { DefaultProps, Flex, Group, Modal, Tabs, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessage2Share, IconMessagePlus, IconMessages, IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import GroupChatCreateModal from './CreateChat/CreateGroupChat';
import JoinGroupChatModal from './CreateChat/JoinGroupChat';
import DirectMessageCreateModal from './DirectMessageCreateModal';
import SideBarFriends from './SidebarFriends';

const Navbar: FC<DefaultProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal size='xl' title='Create a New Chat' opened={opened} onClose={close}>
        <Tabs color='secondary' defaultValue='create-group-chat'>
          <Tabs.List grow>
            <Tabs.Tab value='create-group-chat' icon={<IconMessage2Share size='0.8rem' />}>
              Create Group Chat
            </Tabs.Tab>
            <Tabs.Tab value='create-direct-chat' icon={<IconMessages size='0.8rem' />}>
              Direct Message
            </Tabs.Tab>
            <Tabs.Tab value='join-group-chat' icon={<IconMessagePlus size='0.8rem' />}>
              Join Chat
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='create-group-chat'>
            <GroupChatCreateModal close={close} />
          </Tabs.Panel>
          <Tabs.Panel value='create-direct-chat'>
            <DirectMessageCreateModal close={close} />
          </Tabs.Panel>
          <Tabs.Panel value='join-group-chat'>
            <JoinGroupChatModal close={close} />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Group
        position='apart'
        p='xl'
        style={{ backgroundColor: '#2f252f', height: 72, borderRadius: '10px 0 0 0' }}
      >
        <Text weight='bold' color='orange' size='xl'>
          Chats
        </Text>
        <UnstyledButton onClick={open}>
          <IconPlus
            strokeWidth='7.5'
            style={{
              borderRadius: '50%',
              backgroundColor: 'green',
              padding: '6',
            }}
          />
        </UnstyledButton>
      </Group>
    </>
  );
};

const Sidebar: FC = () => {
  return (
    <Flex direction='column' h='100%' style={{ flex: 1 }}>
      <Navbar />
      <SideBarFriends />
    </Flex>
  );
};

export default Sidebar;
