# graphql-rest-server

## Installation

```sh
# Clone (or fork) the repo
git clone https://github.com/<username>/<repository_name>.git && cd <repository_name>

# dockerize the project
node setup

# flags
--yes || -y # to skip question and go with default options
--force-reinstall || -f # to reinstall node_modules

# run the server
npm run dev
```

## mysql

```sh
# docker to open bash
docker exec -it <container_name> bash

# docker to open mysql
docker exec -it <container_name> mysql -u<user> -p<password> -h<host> <name>

# <name> is the database name

# flags
-it # for interactive
-u # for username
-p # for password
-h # for host
```

## redis commands

```sh
docker exec -it <container_name> redis-cli -a <password>
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
# flags
--no-verify # it will not call pre-hook of commit where tests/linting will execute

```
