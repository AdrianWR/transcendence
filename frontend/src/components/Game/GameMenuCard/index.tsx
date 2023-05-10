import { Paper, Title, UnstyledButton } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';
import styles from './GameMenuCard.module.css';

interface GameMenuCardProps extends PropsWithChildren {
  backgroundColor?: string;
  onClick?: () => void;
}

const GameMenuCard: FC<GameMenuCardProps> = ({ children, onClick }) => {
  return (
    <UnstyledButton onClick={onClick}>
      <Paper className={styles['game-card']}>
        <Title size={24} color='white' m='md'>
          {children}
        </Title>
      </Paper>
    </UnstyledButton>
  );
};

export default GameMenuCard;
