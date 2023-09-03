#!/bin/bash -ex

DIST_PATH="${HOME}/fchat-rising/electron/dist"

cd "${HOME}/fchat-rising"
git checkout canary
git pull
yarn

rm -rf "${DIST_PATH}"

cd electron
yarn build:dist
