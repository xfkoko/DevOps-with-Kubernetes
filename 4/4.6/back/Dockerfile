FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
RUN npm install express
RUN npm install pg
RUN npm install nats

COPY . .

CMD  ["npm", "start"]