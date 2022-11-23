FROM node:18.7.0

RUN apt-get update && apt-get install -y vim

USER node

WORKDIR /home/node/app

CMD [ "npm", "run", "dev", "--prefix","transcendence" ]
