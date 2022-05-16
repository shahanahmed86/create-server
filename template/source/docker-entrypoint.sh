#!/bin/sh

ENV_VARS=$(printenv | grep _FILE)
LENGTH=$(printenv | grep _FILE | wc -l)

if [ $LENGTH -gt 0 ]; then
  for ENV_VAR in $ENV_VARS; do
    # getting key by excluding _FILE letters from it
    KEY=$(echo $ENV_VAR | cut -d'=' -f1 | cut -d'FILE=' -f1)

    # getting length of the key
    LEN=${#KEY}

    # reassigning the key
    KEY=${KEY:0:LEN-1}

    # getting the value of the env variable but it will the path to secret file
    VAL=$(echo $ENV_VAR | cut -d'=' -f2)

    # getting the content of the path which has the secret
    VAL=$(cat $VAL)

    $KEY=$VAL

    echo export $KEY
  done
fi
