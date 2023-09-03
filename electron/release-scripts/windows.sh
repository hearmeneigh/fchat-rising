#!/bin/bash -ex

if [ -z "${1}" ]
then
  echo "Usage: ${0} RELEASE_VERSION"
  exit 1
fi

export NODE_OPTIONS=--openssl-legacy-provider

RELEASE_VERSION="${1}"
RELEASE_PATH="${HOME}/fchat-rising-dist/${RELEASE_VERSION}"
DIST_PATH="${HOME}/fchat-rising/electron/dist"

cd "${HOME}/fchat-rising"
git checkout master
git pull
yarn

mkdir -p "${RELEASE_PATH}"
rm -rf "${DIST_PATH}"

cd electron
yarn build:dist
node pack.js

