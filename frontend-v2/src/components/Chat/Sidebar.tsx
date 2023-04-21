import { DefaultProps, Flex, Group, Modal, Tabs, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessage2Share, IconMessages, IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import { useSocket } from '../../hooks/socket';
import GroupChatCreateModal from './CreateChat/CreateGroupChat';
import DirectMessageCreateModal from './DirectMessageCreateModal';
import SideBarFriends from './SidebarFriends';

const Navbar: FC<DefaultProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { socket } = useSocket();

  // useEffect(() => {
  //   socket?.on('listMessages', () => {
  //     console.log('listMessages');
  //     close();
  //   });
  // }, [socket]);

  return (
    <>
      <Modal size='xl' title='Create a New Chat' opened={opened} onClose={close}>
        <Tabs color='secondary' defaultValue='direct'>
          <Tabs.List grow>
            <Tabs.Tab value='group' icon={<IconMessage2Share size='0.8rem' />}>
              Create Group Chat
            </Tabs.Tab>
            <Tabs.Tab value='direct' icon={<IconMessages size='0.8rem' />}>
              Direct Message
            </Tabs.Tab>
            <Tabs.Tab value='two'>Two</Tabs.Tab>
            <Tabs.Tab value='three'>Three</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='group'>
            <GroupChatCreateModal close={close} />
          </Tabs.Panel>
          <Tabs.Panel value='direct'>
            <DirectMessageCreateModal close={close} />
          </Tabs.Panel>
          <Tabs.Panel value='two'>Two content</Tabs.Panel>
          <Tabs.Panel value='three'>Three content</Tabs.Panel>
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
