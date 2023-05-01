import { Avatar, Container, Flex, Overlay, Stack, Text } from '@mantine/core';
import p5Types from 'p5';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Sketch from 'react-p5';
import { useLocation } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { IUser } from '../../../context/AuthContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import styles from './Canvas.module.css';

interface IBall {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    dx: number;
    dy: number;
  };
  diameter: number;
}

interface IPlayer {
  id: number;
  position: {
    x: number;
    y: number;
  };
  thickness: number;
  length: number;
  score: number;
}

type IStatus = 'waiting' | 'ready' | 'playing' | 'paused' | 'finished' | 'idle';

type ICanvas = {
  height: number;
  width: number;
};

export interface IGameState {
  id: string;
  status: IStatus;
  playerOne: IPlayer;
  playerTwo: IPlayer;
  ball: IBall;
  canvas: ICanvas;
}

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
        {status === 'finished' && 'Game is finished...'}
      </Text>
    </Overlay>
  );
};

const GameCanvas: FC = () => {
  const speed = 5;

  const { user } = useAuthContext();
  const gameSocket = useRef<Socket | null>(null);
  const location = useLocation();
  const [playerOneUser, setPlayerOneUser] = useState<IUser>();
  const [playerTwoUser, setPlayerTwoUser] = useState<IUser>();
  const [game, setGame] = useState<IGameState | null>(null);

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
    api
      .get<IUser>(`/users/${game?.playerOne.id}`)
      .then((response) => setPlayerOneUser(response.data));
    api
      .get<IUser>(`/users/${game?.playerTwo.id}`)
      .then((response) => setPlayerTwoUser(response.data));
  }, [game]);

  const moveUp = (player: IPlayer) => {
    if (player.position.y > 0) {
      return (player.position.y -= speed);
    }
    return player.position.y;
  };

  const moveDown = (player: IPlayer) => {
    if (!game) return;
    if (player.position.y + player.length < game.canvas.height) {
      return (player.position.y += speed);
    }
    return player.position.y;
  };

  const activePlayer = useMemo(() => {
    if (!game || !user) return null;

    if (game.playerOne.id === user.id) {
      return game.playerOne;
    } else if (game.playerTwo.id === user.id) {
      return game.playerTwo;
    }
    return null;
  }, [game, user]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 500).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    if (!game) return;

    p5.clear();
    p5.frameRate(60);

    const { playerOne, playerTwo, ball } = game;

    const drawPlayerBar = (player: IPlayer) => {
      p5.rect(
        player.position.x,
        player.position.y,
        player.thickness,
        player.length,
        10,
        10,
        10,
        10,
      );
    };

    p5.fill(255, 109, 66);
    p5.noStroke();
    drawPlayerBar(playerOne);
    drawPlayerBar(playerTwo);
    p5.circle(ball.position.x, ball.position.y, ball.diameter);

    // if user is an active player, listen for key presses
    if (activePlayer) {
      if (p5.keyIsDown(p5.UP_ARROW)) {
        gameSocket.current?.emit('updateGame', moveUp(activePlayer));
      } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
        gameSocket.current?.emit('updateGame', moveDown(activePlayer));
      }
    }
  };

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
                {game?.playerOne.score}
              </Text>
            </Stack>
            <Text size='xl' color='secondary'>
              VS
            </Text>
            <Stack spacing={1} align='center'>
              <Text className={styles['match-card-player-name']}>{playerTwoUser?.username}</Text>
              <Text color='secondary' className={styles['match-card-player-score']}>
                {game?.playerTwo?.score}
              </Text>
            </Stack>
            <Avatar src={playerTwoUser?.avatarUrl} size='lg' radius='xl' />
          </Flex>
          <Sketch setup={setup} draw={draw} />
        </Stack>
      </Container>
    </>
  );
};

export default GameCanvas;
