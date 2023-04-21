import { FC, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { Bola, Jogador, Jogo } from './pong';

const Pong: FC = () => {
  const jogo = useRef<Jogo>();
  const bola1 = useRef<Bola>();
  const jogador1 = useRef<Jogador>();
  const jogador2 = useRef<Jogador>();
  const width = 500;
  const height = 500;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
    jogo.current = new Jogo();
    bola1.current = new Bola(p5, jogo.current, width, height);
    jogador1.current = new Jogador(p5, 1, width, height);
    jogador2.current = new Jogador(p5, 2, width, height);
    jogo.current.setarBola(bola1.current);
  };

  const draw = (p5: p5Types) => {
    p5.background(55, 20, 200);
    jogador1.current?.desenhar();
    jogador2.current?.desenhar();
    if (jogo.current?.rodando == true) {
      bola1.current?.desenhar();
      bola1.current?.movimentar();
      bola1.current?.checarBordas();
      jogador1.current?.movimentar();
      jogador2.current?.movimentar();
      if (jogador1.current) {
        bola1.current?.checarColisaoPlayer(jogador1.current);
      }
      if (jogador2.current) {
        bola1.current?.checarColisaoPlayer(jogador2.current);
      }
    } else {
      if (p5.keyIsDown(p5.ENTER)) {
        jogo.current?.iniciar();
      }
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default Pong;
