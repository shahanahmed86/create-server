FROM node:16-alpine

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

RUN apk upgrade && apk update && apk --no-cache add \
  mysql-client \
  bash \
  curl

COPY --chown=node:node ./package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
  then npm ci --only=production --ignore-script && npm cache clean --force; \
  else npm install; \
  fi;

COPY --chown=node:node . .
USER node

EXPOSE 4000

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

CMD [ "node", "index.js" ]
