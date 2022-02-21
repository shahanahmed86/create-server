FROM node:14

RUN apt-get update
RUN apt-get install mysql-client -y

WORKDIR /app

COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
  then npm install --only=production --ignore-script; \
  else \
  if [ "$NODE_ENV" = "test" ]; \
  then npm install --ignore-script; \
  else npm install; \
  fi; \
  fi;

COPY . ./

ENV PORT 4000
EXPOSE $PORT

CMD [ "node", "index.js" ]
