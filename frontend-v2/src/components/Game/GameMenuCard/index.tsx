import { Paper, Title } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './GameMenuCard.module.css';

interface GameMenuCardProps extends PropsWithChildren {
  route: string;
  backgroundColor?: string;
}

const GameMenuCard: FC<GameMenuCardProps> = ({ children, backgroundColor, route }) => {
  return (
    <Link to={route}>
      <Paper
        styles={{
          backgroundColor: 'red',
        }}
        className={styles['game-card']}
      >
        <Title size={24} color='white' m='md'>
          {children}
        </Title>
      </Paper>
    </Link>
  );
};

export default GameMenuCard;
