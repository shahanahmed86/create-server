# graphql-rest-server

## Installation

```sh
# Clone (or fork) the repo
git clone https://github.com/shahanahmed86/<repository_name>.git && cd <repository_name>

# dockerize the project
node setup

# supported databases (mysql, postgresql) can be provided as an argument, like:
node setup mysql
# or
node setup postgresql
# if you've dockerize it and selected postgresql option then you have to change docker-compose.yml file accordingly.

# flags
--yes # to skip question and go with default options
--force-reinstall # to reinstall node_modules
--dockerize # off-course

# run the server
npm run dev
```

## mysql

```sh
# docker to open bash
docker exec -it <container_name> bash

# docker to open mysql
docker exec -it <container_name> mysql -u root -p prisma

# flags
-it # for interactive
-u # for username
-p # database
```

## postgresql

```sh
# docker to open bash
docker exec -it <container_name> bash

# docker to open psql
docker exec -it <container_name> psql -U prisma -W dev

# flags
-it # for interactive
-U # for username
-W # database
# postgresql terminal commands list
```

## redis commands

```sh
docker exec -it <container_name> redis-cli -a secret
# flags
-it # for interactive
redis-cli # to load redis command line interface
-a # cli password
# redis commands
scan 0
get "unique_identifier"
ttl "unique_identifier"
del "unique_identifier"
```

## git
```sh
git commit -m "message" --no-verify
#flags
--no-verify # it will not call pre-hook of commit where tests/linting will execute

```
