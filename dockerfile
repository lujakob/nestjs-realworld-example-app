FROM node:12.18-alpine as builder

WORKDIR /install

ENV HUSKY_SKIP_INSTALL=1

COPY package*.json ./
RUN npm ci && \
    npm cache clean --force

COPY . .
RUN npm run build && \
    npm prune --production

# build final image
FROM node:12.18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node

COPY --from=builder --chown=node:node /install ./

EXPOSE 3000
CMD ["node", "dist/main"]

## by default Docker does not handle SIGINT and SIGTERM - can be fixed with `docker run --init`
