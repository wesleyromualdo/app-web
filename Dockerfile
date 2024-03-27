FROM node:16.15.1 AS build

# Atualize e instale dependências, depois limpe o cache
RUN apt-get update && apt-get install curl unzip -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./package*.json  ./

COPY . .

RUN npm i && npm run build

FROM nginx:1.17-alpine

ENV uri='$uri' host='$host' scheme='$scheme' remote_addr='$remote_addr' proxy_add_x_forwarded_for='$proxy_add_x_forwarded_for'

WORKDIR /usr/share/nginx/html

COPY config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build  /app/dist .

# RUN apk add --no-cache gettext \
#     && rm -f /etc/nginx/conf.d/default.conf \
#     && chmod +x run_webapp.sh

EXPOSE 3000

CMD ["nginx","-g","daemon off;"]
