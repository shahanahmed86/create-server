# @shahanahmed86/create-server

## Prerequisites

- ### Resources
  - [Docker Engine](https://get.docker.com/ 'https://get.docker.com/')
  - [Docker Compose](https://docs.docker.com/engine/install/ubuntu/ 'https://docs.docker.com/engine/install/ubuntu/')
  - [NODE](https://nodejs.org/en/ 'https://nodejs.org/en/') or [NVM](https://gist.github.com/shahanahmed86/77616c67e0397a7ed2db89a4a71801d0#node-version-managers-using-nvm 'https://gist.github.com/shahanahmed86/77616c67e0397a7ed2db89a4a71801d0#node-version-managers-using-nvm')
- ### Knowledge
  - Restful
  - GraphQL with custom directives
  - Docker architecture
  - Container orchestration with docker-compose **_(at-least)_**
  - node/npm

## Implemented Feature

- User authentication APIs
- ESM (import/export)
- File Upload with express-fileupload
- API documentation with Swagger
- Pre-commit hook to check linting and coding format
- Chai & Mocha used to cover test cases for Unit-testing/APIs.

## Installation

```sh
# supported databases is mysql
@shahanahmed86/create-server
```

```sh

# flags
(--yes || -y) # to skip question and go with default options
(--install || -i) # to setup the server
```

```sh
# Logs: running docker logs
docker logs <container_name> (--follow || -f)
```
