FROM node:18.12.0-alpine3.16

RUN apk update && apk upgrade && apk add bash vim 

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app

CMD [ "npm", "run", "start" ]
