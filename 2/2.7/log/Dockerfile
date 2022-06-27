FROM node:alpine

WORKDIR /usr/src/app

COPY package* ./

RUN npm ci
RUN npm install request
RUN npm install express
RUN npm install cors

COPY . .

CMD  ["npm", "start"]