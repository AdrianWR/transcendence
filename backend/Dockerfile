FROM node:18.7.0

RUN apt-get update && apt-get install -y vim

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app

CMD [ "npm", "run", "start:dev", "--prefix","transcendence" ]
