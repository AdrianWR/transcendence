import p5Types from 'p5';
import { FC, MutableRefObject, useMemo } from 'react';
import Sketch from 'react-p5';
import { Socket } from 'socket.io-client';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { IBall, IGameState, IPlayer } from './types';

type GameSketchProps = {
  game: IGameState;
  socket: MutableRefObject<Socket | null>;
};

const GameSketch: FC<GameSketchProps> = ({ game, socket }) => {
  const defaultCanvas = {
    height: 400,
    width: 800,
  };

  const { user } = useAuthContext();

  const activePlayer = useMemo(() => {
    if (game.playerOne?.id === user?.id) {
      return game.playerOne;
    } else if (game.playerTwo?.id === user?.id) {
      return game.playerTwo;
    }
    return null;
  }, [game, user]);

  const handleKeyPressed = (p5: p5Types) => {
    if (!activePlayer) return;

    switch (p5.keyCode) {
      case p5.ENTER:
        if (game.status === 'playing') {
          socket.current?.emit('pauseGame');
        } else if (game.status === 'paused') {
          socket.current?.emit('resumeGame');
        }
        break;
      default:
        break;
    }
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(defaultCanvas.width, defaultCanvas.height).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.clear();
    p5.frameRate(60);

    const { playerOne, playerTwo, ball } = game;

    const drawPlayerBar = (player?: IPlayer) => {
      if (!player) return;
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

    const drawBall = (ball?: IBall) => {
      if (!ball) {
        p5.circle(defaultCanvas.width / 2, defaultCanvas.height / 2, 10);
        return;
      }
      p5.circle(ball.position.x, ball.position.y, ball.diameter);
    };

    p5.fill(255, 109, 66);
    p5.noStroke();
    drawPlayerBar(playerOne);
    drawPlayerBar(playerTwo);
    drawBall(ball);

    // if user is an active player, listen for key presses
    if (activePlayer) {
      if (p5.keyIsDown(p5.UP_ARROW)) {
        socket.current?.emit('updateGame', 'up');
      } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
        socket.current?.emit('updateGame', 'down');
      }
    }
  };

  return <Sketch setup={setup} draw={draw} keyPressed={handleKeyPressed} />;
};

export default GameSketch;
