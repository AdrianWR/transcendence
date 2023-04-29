import { Overlay } from '@mantine/core';
import p5Types from 'p5';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Sketch from 'react-p5';
import { useLocation } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { useAuthContext } from '../../../hooks/useAuthContext';

interface IBall {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    dx: number;
    dy: number;
  };
}

interface IPlayer {
  id?: number;
  position: {
    x: number;
    y: number;
  };
  score: number;
}

export interface IGameState {
  id?: string;
  isActive: boolean;
  playerOne?: IPlayer;
  playerTwo?: IPlayer;
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
  const [game, setGame] = useState<IGameState>({
    isActive: false,
    playerOne: {
      position: {
        x: 0,
        y: 0,
      },
      score: 0,
    },
    playerTwo: {
      position: {
        x: 0,
        y: 0,
      },
      score: 0,
    },
    ball: {
      position: {
        x: 0,
        y: 0,
      },
      velocity: {
        dx: 0,
        dy: 0,
      },
    },
  });

  useEffect(() => {
    console.log('Location', location.pathname);

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
    if (game.playerOne?.id === user?.id) {
      return game.playerOne;
    } else if (game.playerTwo?.id === user?.id) {
      return game.playerTwo;
    }
    return null;
  }, [game, user]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvas.width, canvas.height).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
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

    if (game.playerOne) {
      p5.rect(game.playerOne.position.x, game.playerOne.position.y, 20, 120);
    }

    if (game.playerTwo) {
      p5.rect(game.playerTwo.position.x, game.playerTwo.position.y, 20, 120);
    }

    // p5.rect(game.playerTwo?.position.x, playerTwo.position.y, playerTwo.width, playerTwo.length);

    // jogador2.current?.desenhar();
    // p5.rect(playerTwo.position.x, playerTwo.position.y, playerTwo.width, PlayerTwo.height);
    // if (jogo.current?.isActive == true) {
    //   // Draw ball
    //   p5.circle(ball.posicaoX, ball.posicaoY, Ball.diameter);
    //   bola1.current?.drawBall();
    //   bola1.current?.move();
    //   bola1.current?.checkBorders();
    //   playerOne.current?.move();
    //   jogador2.current?.move();
    //   if (playerOne.current) {
    //     bola1.current?.checkPlayerCollision(playerOne.current);
    //   }
    //   if (jogador2.current) {
    //     bola1.current?.checkPlayerCollision(jogador2.current);
    //   }
    // } else {
    //   if (p5.keyIsDown(p5.ENTER)) {
    //     jogo.current?.iniciar();
    //   }
    // }
  };

  return (
    <>
      {game.isActive && (
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
      <Sketch setup={setup} draw={draw} />
    </>
  );
};

export default GameCanvas;
