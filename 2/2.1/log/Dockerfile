FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
RUN npm install request

COPY . .

CMD  ["npm", "start"]