import { Box, Container, Flex, Overlay, Stack, Text } from '@mantine/core';
import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { IUser } from '../../../context/AuthContext';
import { IMatch } from '../../../context/GameContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import UserAvatar from '../../UserAvatar';
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
  const { gameId } = useParams(); // id of the game
  const { user } = useAuthContext();
  const [game, setGame] = useState<IGameState | null>(null);
  const [playerOneUser, setPlayerOneUser] = useState<IUser>();
  const [playerTwoUser, setPlayerTwoUser] = useState<IUser>();
  const [playerOneScore, setPlayerOneScore] = useState<number>(0);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);
  const gameSocket = useRef<Socket | null>(null);

  useEffect(() => {
    gameSocket.current = io(`${process.env.REACT_APP_BACKEND_URL}/game`, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { id: gameId, user },
    });

    gameSocket.current.on('updateGame', (game) => {
      setGame(game);
    });

    gameSocket.current.on('userJoin', (game) => {
      api
        .get<IUser>(`/users/${game?.playerTwo?.id}`)
        .then((response) => setPlayerTwoUser(response.data));
    });

    api.get<IMatch>(`matches/${gameId}`).then((response) => {
      setPlayerOneScore(response.data.playerOneScore);
      setPlayerTwoScore(response.data.playerTwoScore);
      api.get<IUser>(`/users/${response.data.playerOne.id}`).then((response) => {
        setPlayerOneUser(response.data);
      });
      if (response.data.playerTwo) {
        api.get<IUser>(`/users/${response.data.playerTwo.id}`).then((response) => {
          setPlayerTwoUser(response.data);
        });
      }
    });

    return () => {
      gameSocket.current?.off('updateGame');
      gameSocket.current?.off('userJoin');
      gameSocket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!game) return;

    if (game.status === 'playing' || game.status === 'paused') {
      setPlayerOneScore(game?.playerOne?.score ?? 0);
      setPlayerTwoScore(game?.playerTwo?.score ?? 0);
    }
  }, [game?.status, game?.playerOne?.score, game?.playerTwo?.score]);

  return (
    <>
      <Container className={styles['canvas-container']}>
        <Stack align='center'>
          <Flex align='center' gap='xl' className={styles['match-card-score-board']}>
            <UserAvatar user={playerOneUser} size='lg' />
            <Stack spacing={0} align='center'>
              <Text className={styles['match-card-player-name']}>{playerOneUser?.username}</Text>
              <Text color='secondary' className={styles['match-card-player-score']}>
                {playerOneScore}
              </Text>
            </Stack>
            <Text size='xl' color='secondary'>
              VS
            </Text>
            <Stack spacing={0} align='center'>
              <Text className={styles['match-card-player-name']}>{playerTwoUser?.username}</Text>
              <Text color='secondary' className={styles['match-card-player-score']}>
                {playerTwoScore}
              </Text>
            </Stack>
            <UserAvatar user={playerTwoUser} size='lg' radius='xl' />
          </Flex>
          {game && (
            <Box className={styles['game-box']}>
              <GameCanvasOverlay status={game?.status} />
              <GameSketch game={game} socket={gameSocket} />
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default GameCanvas;
