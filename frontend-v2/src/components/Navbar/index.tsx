import { Flex, Image, Space, Text } from '@mantine/core';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignUpButton from '../buttons/SignUpButton';
import items from './items.json';
import styles from './Navbar.module.css';

type MenuItem = {
  name: string;
  path: string;
};

const Navbar: FC = () => {
  const router = useLocation();

  const isActive = (item: MenuItem): boolean => String(router.pathname) === item.path;

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
          {items.map((item: MenuItem) => (
            <Flex
              key={item.name.toLowerCase()}
              className={`${styles['page-nav-link']} ${isActive(item) ? styles['active'] : ''}`}
            >
              <Link to={item.path}>
                <Text weight='bold'>{item.name}</Text>
              </Link>
              <Space w='xl' />
            </Flex>
          ))}
          <Space w={36} />
          <SignUpButton />
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
