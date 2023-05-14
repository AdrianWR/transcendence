import { Affix, Anchor, Drawer, Kbd, Text, ThemeIcon, Title, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconQuestionMark } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './GameInstructions.module.css';

const GameInstructions: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Affix position={{ bottom: rem(120), right: rem(80) }}>
        <ThemeIcon onClick={open} className={styles['game-instructions-theme-icon']}>
          <IconQuestionMark size={36} stroke={2} />
        </ThemeIcon>
      </Affix>
      <Drawer opened={opened} onClose={close} position='right' padding='md'>
        <Title order={3} style={{ marginBottom: 16 }}>
          How to play
        </Title>
        <Text size='lg' weight={500}>
          Use the {<Kbd size='md'>▲</Kbd>} up and {<Kbd size='md'>▼</Kbd>} down arrow keys to move
          the paddle. The goal is to hit the ball with the paddle and make it go past the
          opponent&apos;s paddle.
          <br />
          <br />
          If you miss the ball, the opponent gets a point. The first player to reach 3 points wins
          the game.
          <br />
          <br />
          Pressing {<Kbd size='md'>Enter</Kbd>} or leaving the game screen will pause the game. Be
          careful though; if both players leave the game screen, the game will be aborted and no
          points will be awarded.
          <br />
          <br />
          Good luck!
          <br />
          <br />
        </Text>
        <Text size='sm' weight={500}>
          <Text component='span' style={{ cursor: 'pointer' }}>
            <Anchor
              href='https://www.youtube.com/watch?v=it0sf4CMDeM'
              target='_blank'
              rel='noreferrer'
              color='blue'
            >
              Click here
            </Anchor>
          </Text>{' '}
          to watch a video tutorial.
        </Text>
      </Drawer>
    </>
  );
};

export default GameInstructions;
