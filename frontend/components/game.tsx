import dynamic from 'next/dynamic';
import p5Types from "p5";
import { ComponentType, FC, useEffect } from "react";
import { SketchProps } from "react-p5";
import { Socket, io } from "socket.io-client";

// Will only import `react-p5` on client-side
const Sketch: ComponentType<SketchProps> = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

interface GameComponentProps {
  gameGateway: string
}

type UserState = {
  position: {
    readonly x: number
    readonly y: number
  }
}

let userState: UserState = {
  position: {
    x: 50,
    y: 50
  }
}

const GameComponent: FC<GameComponentProps> = ({ gameGateway }: { gameGateway: string }) => {

  let socket: Socket;

  let positions = {}

  useEffect(() => {
    socket = io(gameGateway, {
      transports: ["websocket"],
    });
    return () => {
      socket.disconnect();
    }
  }, []);

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const cnv = p5.createCanvas(500, 500).parent(canvasParentRef);

    cnv.mousePressed(() => {
      //when you click on the canvas, update your position
      socket.emit("updatePosition", {
        x: p5.mouseX / p5.width, // always send relative number of position between 0 and 1
        y: p5.mouseY / p5.height //so it positions are the relatively the same on different screen sizes.
      });
    })
    p5.fill(255);
    //p5.frameRate(30);

    socket.on("positions", (data) => {
      //get the data from the server to continually update the positions
      positions = data;
      draw(p5);
    });
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    for (const id in positions) {
      const position = positions[id];
      p5.circle(position.x * p5.width, position.y * p5.height, 10);
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default GameComponent