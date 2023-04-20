import { Flex, Image, Space, Text } from '@mantine/core';
import { FC, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import routes, { IRoutesConfig } from '../../routes/routes.config';
import api from '../../services/api';
import NavbarAvatar from '../NavbarAvatar';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const router = useLocation();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      api.get('/users/me'); // this seems to be done on the auth context when signin and the email will be updated when page reloads or when profile is updated
    }
  }, [user]);

  const isActive = (route: IRoutesConfig): boolean =>
    String(router.pathname) === route.path ||
    String(router.pathname).includes(route.name.toLowerCase());

  return (
    <nav>
      <Flex justify='space-between' align='center' py='sm' px='xl' className={styles['nav-header']}>
        <Flex align='center'>
          <Image src='/images/logo.svg' width={48} alt={''} />
          <Text ml='md' color='white' weight='bold'>
            42 Transcendence
          </Text>
        </Flex>

        <Flex justify='flex-end' align='center'>
          {routes.map((route: IRoutesConfig) =>
            route.showOnNavbar ? (
              <Flex
                key={route.name.toLowerCase()}
                className={`${styles['page-nav-link']} ${isActive(route) ? styles['active'] : ''}`}
              >
                <Link to={route.navPath || route.path}>
                  <Text weight='bold'>{route.name}</Text>
                </Link>
                <Space w='xl' />
              </Flex>
            ) : null,
          )}
          <Space w={36} />
          <NavbarAvatar />
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
