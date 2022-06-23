# Adding test stage, and avoiding source in dev

FROM node:16-bullseye-slim as base
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  default-mysql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
EXPOSE 4000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node ./package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
HEALTHCHECK --interval=30s --retries=5 --timeout=5s CMD node /app/healthchecks/server-healthcheck.js

# dev stage (no source added, assumes bind mount)
FROM base as dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
RUN npm install && npm cache clean --force
CMD ["nodemon", "index.js"]

# copy in source code for test and prod stages
# we do this in its own stage to ensure the
# layers we test are the exact hashed layers the cache
# uses to build prod stage
FROM base as source
COPY --chown=node:node . .

# test stage: combine source code and dev stage deps
FROM source as test
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
COPY --from=dev /app/node_modules /app/node_modules
RUN npm run lint && npm run prettify
RUN npm run exec-tests
CMD ["npm", "run", "exec-tests"]

### prod stage
FROM source as prod
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
CMD [ "node", "index.js" ]
