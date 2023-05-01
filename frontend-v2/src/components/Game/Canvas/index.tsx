import { Avatar, Container, Flex, Overlay, Stack, Text } from '@mantine/core';
import { FC, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { IUser } from '../../../context/AuthContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import styles from './Canvas.module.css';
import GameSketch from './sketch';
import { IGameState, IStatus } from './types';

interface IGameCanvasOverlayProps {
  status?: IStatus | null;
}

const GameCanvasOverlay: FC<IGameCanvasOverlayProps> = ({ status }) => {
  if (!status || status === 'playing') return null;

  return (
    <Overlay opacity={0.8} color='gray' className={styles['canvas-overlay']}>
      <Text>
        {status === 'waiting' && 'Waiting for another player...'}
        {status === 'idle' && 'Game will start in 3, 2, 1...'}
        {status === 'paused' && 'Game is paused...'}
        {status === 'finished' && 'Game is finished!'}
      </Text>
    </Overlay>
  );
};

const GameCanvas: FC = () => {
  const { user } = useAuthContext();
  const [game, setGame] = useState<IGameState | null>(null);
  const [playerOneUser, setPlayerOneUser] = useState<IUser>();
  const [playerTwoUser, setPlayerTwoUser] = useState<IUser>();
  const gameSocket = useRef<Socket | null>(null);

  useEffect(() => {
    gameSocket.current = io(`${process.env.REACT_APP_BACKEND_URL}/game`, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        id: location.pathname.split('/').slice(-1)[0],
        user: user,
      },
    });

    gameSocket.current.on('updateGame', (game) => {
      setGame(game);
    });

    return () => {
      gameSocket.current?.off('updateGame');

      gameSocket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!game?.playerOne || !game?.playerTwo) return;

    api
      .get<IUser>(`/users/${game?.playerOne?.id}`)
      .then((response) => setPlayerOneUser(response.data));
    api
      .get<IUser>(`/users/${game?.playerTwo?.id}`)
      .then((response) => setPlayerTwoUser(response.data));
  }, [game]);

  return (
    <>
      <Container className={styles['canvas-container']}>
        <GameCanvasOverlay status={game?.status} />
        <Stack align='center'>
          <Flex align='center' gap='xl' className={styles['match-card-score-board']}>
            <Avatar src={playerOneUser?.avatarUrl} size='lg' radius='xl' />
            <Stack spacing={1} align='center'>
              <Text className={styles['match-card-player-name']}>{playerOneUser?.username}</Text>
              <Text color='secondary' className={styles['match-card-player-score']}>
                {game?.playerOne?.score ?? 0}
              </Text>
            </Stack>
            <Text size='xl' color='secondary'>
              VS
            </Text>
            <Stack spacing={1} align='center'>
              <Text className={styles['match-card-player-name']}>{playerTwoUser?.username}</Text>
              <Text color='secondary' className={styles['match-card-player-score']}>
                {game?.playerTwo?.score ?? 0}
              </Text>
            </Stack>
            <Avatar src={playerTwoUser?.avatarUrl} size='lg' radius='xl' />
          </Flex>
          {game && <GameSketch game={game} socket={gameSocket} />}
        </Stack>
      </Container>
    </>
  );
};

export default GameCanvas;
