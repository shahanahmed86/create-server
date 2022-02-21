#!/bin/sh

printf "Please wait"
while ! mysql --user=root --password=${DB_PASS} --host=${DB_HOST} -e "SELECT 1" >/dev/null 2>&1;
  do
    printf "."
    sleep 2
  done
  printf "done\n"
  npm run db:deploy
