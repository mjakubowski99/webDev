#!/bin/sh

npm install

chown -R node:node /usr/src/app/node_modules/

exec "$@"