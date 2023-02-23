# syntax=docker/dockerfile:1

FROM node:14


WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000
ENV NODE_ENV "production"

CMD [ "npm", "run", "start" ]