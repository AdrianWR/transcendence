FROM node:lts AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM node:lts

ARG NODE_ENV=production
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]