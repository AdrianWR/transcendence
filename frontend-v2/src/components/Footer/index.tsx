import { Text } from '@mantine/core';
import * as React from 'react';
import styles from './styles.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Text color='lightGrey'>Copyright &copy; 2023 Transcendence</Text>
    </footer>
  );
};

export default Footer;
