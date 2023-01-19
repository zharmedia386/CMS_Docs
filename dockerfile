#syntax=docker/dockerfile:1
FROM node:14-alpine

WORKDIR /server

ADD  ./server /server

RUN npm install

EXPOSE 5000

CMD [ "node", "server.js" ]