import dynamic from 'next/dynamic';
import p5Types from "p5";
import { ComponentType, FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { SketchProps } from "react-p5";
import { Socket, io } from "socket.io-client";

type IPosition = {
  x: number,
  y: number
}

type IPositions = {
  [id: string]: IPosition,
}

// Will only import `react-p5` on client-side
const Sketch: ComponentType<SketchProps> = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

interface GameComponentProps {
  gateway: string
}

const GameComponent: FC<GameComponentProps> = ({ gateway }) => {
  const socketRef: MutableRefObject<Socket> = useRef(null);
  const [positions, setPositions] = useState({})

  useEffect(() => {
    // Socket domain defaults to the Next.JS proxy rewrite (next.config.js)
    if (socketRef.current == null) {
      socketRef.current = io(gateway, { transports: ['websocket'] });
    }

    socketRef.current.open();

    socketRef.current.on("positions", (data: IPositions) => {
      setPositions(data);
    });

    console

    return () => {
      socketRef.current.disconnect();
    }
  }, [gateway]);

  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const cnv = p5.createCanvas(500, 500).parent(canvasParentRef);

    cnv.mousePressed(() => {
      socketRef.current.emit("updatePosition", {
        x: p5.mouseX / p5.width,    // always send relative number of position between 0 and 1
        y: p5.mouseY / p5.height    //so it positions are the relatively the same on different screen sizes.
      });
    });

    p5.fill(255);
    p5.frameRate(30);
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