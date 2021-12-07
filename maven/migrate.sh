#!/usr/bin/env bash

set -eo pipefail

# REPOSITORY_PATH 是 Maven Repository 的文件目录，通常是 $HOME/.m2/repository
REPOSITORY_PATH=${REPOSITORY_PATH:-"/home/user/.m2/repository"}
# REMOTE_REPO_URL 是 CODING Maven 仓库的 URL，通常格式为: http(s)://<team>-maven.pkg.<domain>/repository/<project>/<repository>
# 需格外注意这里的 URL 结尾是没有斜线的，否则就会报 301.
REMOTE_REPO_URL=${REMOTE_REPO_URL:-"https://demo-maven.pkg.coding.net/repository/test-project/maven-repository"}
CODING_USERNAME=${CODING_USERNAME:-"test"}
CODING_PASSWORD=${CODING_PASSWORD:-"test123"}

echo "REPOSITORY_PATH: [$REPOSITORY_PATH]"
echo "REMOTE_REPO_URL: [$REMOTE_REPO_URL]"
echo "CODING_USERNAME: [$CODING_USERNAME]"
echo "CODING_PASSWORD: [$CODING_PASSWORD]"
echo "Migrating ..."

function doUpload() {
  if [[ ${1#$REPOSITORY_PATH} != *'_remote.repositories'* ]]; then
    echo "============================ Start =================================="
    echo "curl -i -u $CODING_USERNAME:$CODING_PASSWORD -T $1 '${REMOTE_REPO_URL}${1#$REPOSITORY_PATH}'"
    curl -i -u $CODING_USERNAME:$CODING_PASSWORD -T $1 "${REMOTE_REPO_URL}${1#$REPOSITORY_PATH}"
    echo "Migrated $1"
    echo "============================  End  =================================="
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
