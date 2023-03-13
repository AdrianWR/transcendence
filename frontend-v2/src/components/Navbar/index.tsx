import { Button, Flex, Image, Space, Text } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import api from '../../services/api';
import SignUpButton from '../buttons/SignUpButton';
import routes, { IRoutesConfig } from '../../routes/routes.config';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const router = useLocation();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [email, setEmail] = useState('');

  useEffect(() => {
    console.log(user);
    if (user) {
      console.log('Check navbar');
      api.get('/users/me').then((response) => setEmail(response.data?.email));
    }
  }, [user]);

  const isActive = (route: IRoutesConfig): boolean => String(router.pathname) === route.path;

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
                <Link to={route.path}>
                  <Text weight='bold'>{route.name}</Text>
                </Link>
                <Space w='xl' />
              </Flex>
            ) : null,
          )}
          <Space w={36} />
          {user ? (
            <div>
              <Text>{email}</Text>
              <Button onClick={logout}>Log Out</Button>
            </div>
          ) : (
            <SignUpButton />
          )}
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
