FROM node:16-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install --quiet

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:watch" ] // TODO: Fix start:prod
