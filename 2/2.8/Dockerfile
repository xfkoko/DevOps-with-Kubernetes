FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
RUN npm install express

COPY . .

CMD  ["npm", "start"]