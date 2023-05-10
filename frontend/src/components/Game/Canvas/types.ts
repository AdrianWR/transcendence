export type IStatus = 'waiting' | 'ready' | 'playing' | 'paused' | 'finished' | 'idle';

export interface IBall {
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

export interface IPlayer {
  id: number;
  position: {
    x: number;
    y: number;
  };
  thickness: number;
  length: number;
  score: number;
}

export interface ICanvas {
  height: number;
  width: number;
}

export interface IGameState {
  id: string;
  status: IStatus;
  playerOne?: IPlayer;
  playerTwo?: IPlayer;
  ball?: IBall;
  canvas?: ICanvas;
}
