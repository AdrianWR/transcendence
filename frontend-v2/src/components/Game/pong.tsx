import p5Types from 'p5';

export class Bola {
  p5: p5Types;
  width: number;
  height: number;
  posicaoX: number;
  posicaoY: number;
  velocidadeX: number;
  velocidadeY: number;
  diametro: number;
  jogo: Jogo;
  ymenor?: number;
  ymaior?: number;
  xrefencia?: number;

  constructor(p5: p5Types, jogo: Jogo, width: number, height: number) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.posicaoX = width / 2;
    this.posicaoY = height / 2;
    this.velocidadeX = [-5, -3, 3, 5][Math.floor(Math.random() * 4)];
    this.velocidadeY = [-5, -3, 3, 5][Math.floor(Math.random() * 4)];
    this.diametro = 20;
    this.jogo = jogo;
  }

  centralizar(): void {
    this.posicaoX = this.width / 2;
    this.posicaoY = this.height / 2;
  }

  desenhar(): void {
    this.p5.circle(this.posicaoX, this.posicaoY, this.diametro);
  }

  movimentar(): void {
    this.posicaoX += this.velocidadeX;
    this.posicaoY += this.velocidadeY;
  }

  checarBordas(): void {
    if (this.posicaoX - this.diametro / 2 <= 0) {
      this.jogo.pontuar(2);
      this.jogo.parar();
    }
    if (this.posicaoX + this.diametro / 2 >= this.width) {
      this.jogo.pontuar(1);
      this.jogo.parar();
    }

    if (this.posicaoY - this.diametro / 2 <= 0) {
      this.velocidadeY *= -1;
    }
    if (this.posicaoY + this.diametro / 2 >= this.height) {
      this.velocidadeY *= -1;
    }
  }

  checarColisaoPlayer(jogador: Jogador): void {
    this.ymenor = jogador.posicaoY;
    this.ymaior = jogador.posicaoY + jogador.altura;

    if (jogador.id == 1) {
      if (jogador.posicaoX !== undefined) {
        this.xrefencia = jogador.posicaoX + jogador.largura;
      }
      if (
        this.xrefencia !== undefined &&
        this.posicaoX - this.diametro / 2 <= this.xrefencia &&
        this.posicaoX - this.diametro / 2 > 0
      ) {
        if (this.posicaoY >= this.ymenor && this.posicaoY <= this.ymaior) {
          this.velocidadeX *= -1;
        }
      }
    } else if (jogador.id == 2) {
      this.xrefencia = jogador.posicaoX;
      if (
        this.xrefencia !== undefined &&
        this.posicaoX + this.diametro / 2 >= this.xrefencia &&
        this.posicaoX < this.width
      ) {
        if (this.posicaoY >= this.ymenor && this.posicaoY <= this.ymaior) {
          this.velocidadeX *= -1;
        }
      }
    }
  }
}

export class Jogador {
  p5: p5Types;
  width: number;
  height: number;
  id: number;
  altura: number;
  largura: number;
  posicaoX?: number;
  posicaoY: number;
  velocidadeY: number;

  constructor(p5: p5Types, tipoJ: number, width: number, height: number) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.id = tipoJ;
    this.altura = 120;
    this.largura = 20;
    if (this.id == 1) {
      this.posicaoX = 1;
    } else if (this.id == 2) {
      this.posicaoX = width - this.largura;
    }
    this.posicaoY = height / 2;
    this.velocidadeY = 10;
  }

  public movimentar(): void {
    if (this.id == 1) {
      if (this.p5.keyIsDown(this.p5.SHIFT)) {
        if (this.posicaoY > 0) {
          this.posicaoY -= this.velocidadeY;
        } else {
          this.posicaoY = 0;
        }
      }
      if (this.p5.keyIsDown(this.p5.CONTROL)) {
        this.posicaoY += this.velocidadeY;
        if (this.posicaoY + this.altura > this.height) {
          this.posicaoY = this.height - this.altura;
        }
      }
    } else if (this.id == 2) {
      if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
        if (this.posicaoY > 0) {
          this.posicaoY -= this.velocidadeY;
        } else {
          this.posicaoY = 0;
        }
      }
      if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
        this.posicaoY += this.velocidadeY;
        if (this.posicaoY + this.altura > this.height) {
          this.posicaoY = this.height - this.altura;
        }
      }
    }
  }

  public desenhar(): void {
    if (this.posicaoX) {
      this.p5.rect(this.posicaoX, this.posicaoY, this.largura, this.altura);
    }
  }
}

export class Jogo {
  rodando: boolean;
  pontosP1: number;
  pontosP2: number;
  bola?: Bola;

  constructor() {
    this.rodando = false;
    this.pontosP1 = 0;
    this.pontosP2 = 0;
  }

  parar(): void {
    this.rodando = false;
  }

  iniciar(): void {
    this.bola?.centralizar();
    this.rodando = true;
  }

  pontuar(p: number): void {
    if (p == 1) {
      this.pontosP1++;
    } else if (p == 2) {
      this.pontosP2++;
    }
    console.log('Pontos p1: ' + this.pontosP1 + ' Pontos p2: ' + this.pontosP2);
  }

  zerarPontos(): void {
    this.pontosP1 = this.pontosP2 = 0;
  }

  setarBola(bola: Bola): void {
    this.bola = bola;
  }
}
