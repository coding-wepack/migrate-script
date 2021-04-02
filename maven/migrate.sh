#!/usr/bin/env bash

set -eo pipefail

REPOSITORY_PATH=${REPOSITORY_PATH:-/Users/chenxinzhou/.m2/repository}
REMOTE_REPO_URL=${REMOTE_REPO_URL:-http://127.0.0.1:8081/content/repositories/releases/}
USERNAME=${USERNAME:-admin}
PASSWORD=${PASSWORD:-coding123}

function doUpload() {

  if [[ ${1#$REPOSITORY_PATH} != *'_remote.repositories'* ]]; then
    curl -v -u $USERNAME:$PASSWORD -T $1 "${REMOTE_REPO_URL}${1#$REPOSITORY_PATH}"
  fi
}

function ergodic() {
  for file in $(ls $1); do
    if [ -d $1"/"$file ]; then
      ergodic $1"/"$file
    else
      doUpload "$1/$file"
    fi
  done
}

case "$1" in
upload)
  ergodic $REPOSITORY_PATH
  ;;
*)
  ergodic $REPOSITORY_PATH
  ;;
esac
