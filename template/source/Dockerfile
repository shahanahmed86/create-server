FROM node:16-alpine

RUN apk update
RUN apk add mysql-client

WORKDIR /app

COPY ./package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
  then npm install --only=production --ignore-script; \
  else npm install; \
  fi;

COPY . .

RUN chown -R node:node /app
RUN chown -R node:node /app/node_modules
USER node

ENV PORT 4000
EXPOSE $PORT

CMD [ "npm", "run", "start" ]
