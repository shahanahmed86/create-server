# graphql-rest-server

## Installation

```sh
# Clone (or fork) the repo
git clone https://github.com/shahanahmed86/graphql-rest-server.git && cd graphql-rest-server

# dockerize the project
node setup docker

# flags
-f # for reinstalling the node_modules again like "node setup -f" or "node setup docker -f"
docker to setup with docker

# run the server
npm run dev
```

## mysql

```sh
# docker to open bash
docker exec -it graphql-rest-server_db_1 bash

# docker to open mysql
docker exec -it graphql-rest-server_db_1 mysql -u root -p prisma

# flags
-it # for interactive
-u # for username
-p # database
```

## postgresql

```sh
# docker to open bash
docker exec -it graphql-rest-server_db_1 bash
# docker to open plsql
docker exec -it graphql-rest-server_db_1 psql -U prisma -W dev
# flags
-it # for interactive
-U # for username
-W # database
# postgresql terminal commands list
```

## redis commands

```sh
docker exec -it graphql-rest-server_cache_1 redis-cli -a secret
# flags
-it # for interactive
redis-cli # to load redis command line interface
-a # cli password
# redis commands
scan 0
get "adminToken"
ttl "adminToken"
del "adminToken"
```