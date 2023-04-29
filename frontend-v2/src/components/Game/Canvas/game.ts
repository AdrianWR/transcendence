import p5Types from 'p5';
import { ICanvas } from '.';

export enum BoardSide {
  LEFT = 0,
  RIGHT = 1,
}

export type IPlayer = {
  position: {
    x: number;
    y: number;
  };
  score: number;
};

export type IBall = {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    dx: number;
    dy: number;
  };
};

export class Ball implements IBall {
  p5: p5Types;
  width: number;
  height: number;
  // position!: {
  //   x: number;
  //   y: number;
  // };

  static getRandomSpeed = () => [-5, -3, 3, 5][Math.floor(Math.random() * 4)];

  public static diameter = 20;

  constructor(p5: p5Types, width: number, height: number) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.position = {
      x: width / 2,
      y: height / 2,
    };
    this.velocity = {
      dx: Ball.getRandomSpeed(),
      dy: Ball.getRandomSpeed(),
    };
  }
  position: { x: number; y: number };
  velocity: { dx: number; dy: number };

  center = () => {
    this.position.x = this.width / 2;
    this.position.y = this.height / 2;
  };

  drawBall = () => {
    this.p5.circle(this.position.x, this.position.y, Ball.diameter);
  };

  move = () => {
    this.position.x += this.velocity.dx;
    this.position.y += this.velocity.dy;
  };

  checkBorders(): void {
    if (this.position.x - Ball.diameter / 2 <= 0) {
      console.log('ponto 2');
    }
    if (this.position.x + Ball.diameter / 2 >= this.width) {
      console.log('ponto 1');
    }

    if (this.position.y - Ball.diameter / 2 <= 0) {
      this.velocity.dy *= -1;
    }
    if (this.position.y + Ball.diameter / 2 >= this.height) {
      this.velocity.dy *= -1;
    }
  }

  checkPlayerCollision(player: Player): void {
    const lowerLimit = player.position.y;
    const upperLimit = player.position.y + player.length;
    let xWidth = player.position.x + player.width;

    if (player.side == BoardSide.LEFT) {
      if (player.position.x !== undefined) {
        xWidth = player.position.x + player.width;
      }
      if (
        xWidth !== undefined &&
        this.position.x - Ball.diameter / 2 <= xWidth &&
        this.position.x - Ball.diameter / 2 > 0
      ) {
        if (this.position.y >= lowerLimit && this.position.y <= upperLimit) {
          this.velocity.dx *= -1;
        }
      }
    } else if (player.side == BoardSide.RIGHT) {
      xWidth = player.position.x;
      if (
        xWidth !== undefined &&
        this.position.x + Ball.diameter / 2 >= xWidth &&
        this.position.x < this.width
      ) {
        if (this.position.y >= lowerLimit && this.position.y <= upperLimit) {
          this.velocity.dx *= -1;
        }
      }
    }
  }
}

export class Player implements IPlayer {
  canvas: ICanvas;
  side: BoardSide;
  length = 120;
  width = 20;
  speed = 4;

  constructor(canvas: ICanvas, side: BoardSide) {
    this.canvas = canvas;
    this.side = side;
    this.score = 0;
    this.position = {
      x: 0,
      y: 0,
    };

    if (this.side === BoardSide.LEFT) {
      this.position.x = 0;
    } else if (this.side === BoardSide.RIGHT) {
      this.position.x = canvas.width - this.width;
    }

    this.position.y = canvas.height / 2 - this.length / 2;
  }
  position: { x: number; y: number };
  score: number;

  public moveUp = () => {
    if (this.position.y > 0) {
      this.position.y -= this.speed;
    }
  };

  public moveDown = () => {
    if (this.position.y + this.length < this.canvas.height) {
      this.position.y += this.speed;
    }
  };
}

export class Game {
  // isActive: boolean;
  // pointsP1: number;
  // pointsP2: number;
  ball?: Ball;

  // constructor() {
  //   this.isActive = false;
  //   this.pointsP1 = 0;
  //   this.pointsP2 = 0;
  // }

  stop(): void {
    // this.isActive = false;
  }

  iniciar(): void {
    // this.ball?.center();
    // this.isActive = true;
  }

  // pontuar(p: number): void {
  //   if (p == 1) {
  //     this.pointsP1++;
  //   } else if (p == 2) {
  //     this.pointsP2++;
  //   }
  //   console.log('Pontos p1: ' + this.pointsP1 + ' Pontos p2: ' + this.pointsP2);
  // }

  // zerarPontos(): void {
  //   this.pontosP1 = this.pontosP2 = 0;
  // }

  // setBall(bola: Ball): void {
  //   this.ball = bola;
  // }
}
