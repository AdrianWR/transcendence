import {
  Box,
  Button,
  DefaultProps,
  Group,
  MantineNumberSize,
  Modal,
  Selectors,
  Tabs,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import useStyles, { SidebarStylesParams } from './Sidebar.styles';
import SideBarFriends from './SidebarFriends';

type SidebarStylesNames = Selectors<typeof useStyles>;

interface SidebarProps extends DefaultProps<SidebarStylesNames, SidebarStylesParams> {
  radius?: MantineNumberSize;
}

const Navbar: FC<DefaultProps> = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal title='Create a New Chat' opened={opened} onClose={close}>
        <Tabs defaultValue='direct'>
          <Tabs.List>
            <Tabs.Tab value='direct'>With a Friend</Tabs.Tab>
            <Tabs.Tab value='two'>Two</Tabs.Tab>
            <Tabs.Tab value='three'>Three</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='direct'>
            <Button>Add a Friend</Button>
          </Tabs.Panel>
          <Tabs.Panel value='two'>Two content</Tabs.Panel>
          <Tabs.Panel value='three'>Three content</Tabs.Panel>
        </Tabs>
      </Modal>

      <Group position='apart' p='xl' style={{ backgroundColor: '#2f252f', height: '30%' }}>
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

const Sidebar: FC<SidebarProps> = ({
  classNames,
  styles,
  unstyled,
  radius,
  className,
  ...others
}) => {
  const { classes, cx } = useStyles({ radius }, { name: 'Sidebar', classNames, styles, unstyled });

  return (
    <Box className={cx(classes.root, className)} {...others}>
      <div className={classes.title}>
        <Navbar />
        <SideBarFriends />
      </div>
    </Box>
  );
};

export default Sidebar;
