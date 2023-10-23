### STAGE 1: Build ###
FROM node:16.15.1 AS build

WORKDIR /app

COPY . .
COPY ./package*.json ./

RUN npm i

RUN npm run build 

### STAGE 2: Build ###
FROM nginx:1.17-alpine

COPY ./config/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html

COPY --from=build  /app/dist .

EXPOSE 8080

CMD /bin/sh -c "nginx -g 'daemon off;'"
