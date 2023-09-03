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

cp "${DIST_PATH}/arm64/F-Chat-Rising-Setup-win-arm64.exe" "${RELEASE_PATH}/F-Chat-Rising-win-arm64.exe"
cp "${DIST_PATH}/x64/F-Chat-Rising-Setup-win-x64.exe" "${RELEASE_PATH}/F-Chat-Rising-win-x64.exe"
