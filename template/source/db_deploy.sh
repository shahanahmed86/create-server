#!/bin/bash

while ! mysql --user="${DB_USER}" --password="${DB_PASS}" --host="${DB_HOST}" -e "SELECT 1" >/dev/null 2>&1; do
  printf "."
  sleep 2
done
echo

mysql --user="${DB_USER}" --password="${DB_PASS}" --host="${DB_HOST}" "${DB_NAME}" -e "DESC User" >/dev/null 2>&1
if [ $? != 0 ]; then
  npm run db:deploy
else
  npm run db:generate
fi
