#FROM node:18.7.0
FROM node:18.12.0-alpine3.16

#RUN apt-get update && apt-get install -y vim
RUN apk update && apk upgrade && apk add bash && apk add vim
RUN apk add sudo

USER node

WORKDIR /home/node/app

#CMD [ "npm", "run", "dev", "--prefix","transcendence" ]
ENTRYPOINT ["tail", "-f", "/dev/null"]
