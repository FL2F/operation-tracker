# syntax=docker/dockerfile:1

FROM node:14


WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3306

EXPOSE 8080

CMD ["npm", "run", "server"]