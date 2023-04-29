import { Avatar, Flex, Overlay, Stack, Text } from '@mantine/core';
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
  score: number;
}

export interface IGameState {
  id: string;
  status: 'waiting' | 'playing' | 'paused' | 'finished';
  playerOne: IPlayer;
  playerTwo: IPlayer;
  ball: IBall;
}

export type ICanvas = {
  height: number;
  width: number;
};

const GameCanvas: FC = () => {
  const canvas = {
    height: 500,
    width: 800,
  };

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
      console.log(game);
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
      return (player.position.y -= 4);
    }
    return player.position.y;
  };

  const moveDown = (player: IPlayer) => {
    if (player.position.y + 120 < canvas.height) {
      return (player.position.y += 4);
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
    p5.createCanvas(canvas.width, canvas.height).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    if (!game) return;
    p5.background(55, 20, 200);
    p5.frameRate(60);

    // if user is an active player, listen for key presses
    if (activePlayer) {
      if (p5.keyIsDown(p5.UP_ARROW)) {
        gameSocket.current?.emit('updateGame', moveUp(activePlayer));
      } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
        gameSocket.current?.emit('updateGame', moveDown(activePlayer));
      }
    }

    p5.rect(game.playerOne.position.x, game.playerOne.position.y, 20, 120);
    p5.rect(game.playerTwo.position.x, game.playerTwo.position.y, 20, 120);
    p5.circle(game.ball.position.x, game.ball.position.y, game.ball.diameter);
  };

  return (
    <>
      {game && game.status !== 'playing' && (
        <Overlay
          zIndex={1000}
          color='gray'
          opacity={0.8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <h1>Waiting for another player...</h1>
        </Overlay>
      )}
      <Stack>
        <Flex direction='row' align='center' justify='space-between' gap='lg'>
          <Avatar src={playerOneUser?.avatarUrl} size='lg' radius='xl' />
          <Stack spacing={1} align='center'>
            <Text className={styles['match-card-player-name']}>{playerOneUser?.username}</Text>
            <Text color='secondary' className={styles['match-card-player-score']}>
              {game?.playerOne.score}
            </Text>
          </Stack>
          <Text>VS</Text>
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
    </>
  );
};

export default GameCanvas;
