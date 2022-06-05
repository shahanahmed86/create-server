run-dev-up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --detach

run-dev-down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

run-dev-down-hard:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --volume

run-prod-up:
	docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml -c docker-compose.secrets.yml my_project

run-prod-down:
	docker stack rm my_project

run-deep-check:
	npx depcheck --ignores esm,ejs,eslint-plugin-prettier
