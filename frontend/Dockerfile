FROM node:18.12.0-alpine3.16

RUN apk update && apk upgrade && apk add bash vim 

USER node

WORKDIR /home/node/app

CMD [ "npm", "run", "dev" ]
