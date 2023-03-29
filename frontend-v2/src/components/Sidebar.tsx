import {
  Box,
  DefaultProps,
  Group,
  MantineNumberSize,
  Selectors,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import useStyles, { SidebarStylesParams } from './Sidebar.styles';
import SideBarFriends from './SidebarFriends';

type SidebarStylesNames = Selectors<typeof useStyles>;

interface SidebarProps extends DefaultProps<SidebarStylesNames, SidebarStylesParams> {
  radius?: MantineNumberSize;
}

const Navbar: FC<DefaultProps> = () => {
  return (
    <Group position='apart' p='xl' style={{ backgroundColor: '#2f252f', height: '30%' }}>
      <Text weight='bold' color='orange' size='xl'>
        Chats
      </Text>
      <UnstyledButton>
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
  const { user } = useAuthContext();

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
