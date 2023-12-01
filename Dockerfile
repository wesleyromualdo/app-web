### STAGE 1: Build ###
FROM node:16.15.1 AS build

WORKDIR /app

COPY . .
COPY ./package*.json ./

RUN npm i

RUN npm run build 

CMD [ "npm start" ]

