#!/bin/sh

ENV_VARS=$(printenv | grep _FILE)

for ENV_VAR in $ENV_VARS; do
  _KEY=$(echo $ENV_VAR | cut -d'=' -f1 | cut -d'FILE=' -f1)
  LEN=${#_KEY}
  KEY=${_KEY:0:LEN-1}
  VAL=$(echo $ENV_VAR | cut -d'=' -f2)
  export $KEY=$(cat $VAL)
done
