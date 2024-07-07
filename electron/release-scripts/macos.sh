#!/bin/bash -ex

if [ -z "${1}" ]
then
  echo "Usage: ${0} RELEASE_VERSION"
  exit 1
fi

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
rm -rf app
yarn build:dist
node pack.js

cp "${DIST_PATH}/F-Chat Rising Intel.dmg" "${RELEASE_PATH}/F-Chat-Rising-macos-intel.dmg"
rm -f "${RELEASE_PATH}/F-Chat-Rising-macos-intel.zip"
zip --junk-paths "${RELEASE_PATH}/F-Chat-Rising-macos-intel.zip" "${DIST_PATH}/F-Chat Rising Intel.dmg"

cp "${DIST_PATH}/F-Chat Rising M1.dmg" "${RELEASE_PATH}/F-Chat-Rising-macos-m1.dmg"
rm -f "${RELEASE_PATH}/F-Chat-Rising-macos-m1.zip"
zip --junk-paths "${RELEASE_PATH}/F-Chat-Rising-macos-m1.zip" "${DIST_PATH}/F-Chat Rising M1.dmg"
