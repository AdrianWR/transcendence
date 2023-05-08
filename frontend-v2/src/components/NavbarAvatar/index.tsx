import { Avatar, Button, Flex, HoverCard, NavLink } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import SignUpButton from '../Buttons/SignUpButton';
import styles from './NavbarAvatar.module.css';

const NavbarAvatar: FC = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <nav>
      {user ? (
        <Flex className={styles['nav-avatar']} justify='space-between' align='center'>
          <HoverCard width={260} shadow='md' openDelay={100} closeDelay={100}>
            <HoverCard.Target>
              <Link to='/profile/me'>
                <Avatar
                  radius='50%'
                  size='lg'
                  src={user?.avatarUrl}
                  pos='relative'
                  alt='user avatar'
                />
              </Link>
            </HoverCard.Target>
            <HoverCard.Dropdown p='2px'>
              <Flex direction='column' align='center'>
                <NavLink
                  className={styles.navlink}
                  label='Profile'
                  description={user.email}
                  icon={<IconUser size='1rem' stroke={1.5} />}
                  onClick={() => navigate('/profile/me')}
                ></NavLink>
                <Button color='red' onClick={logout} my={10}>
                  Log Out
                </Button>
              </Flex>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>
      ) : (
        <SignUpButton />
      )}
    </nav>
  );
};

export default NavbarAvatar;
