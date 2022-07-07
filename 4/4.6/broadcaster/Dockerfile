FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
RUN npm i --save nats
RUN npm install request

COPY . .

CMD  ["npm", "start"]