#/bin/bash

if [[ -d dist ]]; then
  rm -rf dist
fi
mkdir dist

cp -rf src/* dist/.
cp package*.json dist/.
cp startServer.sh dist/.

zip -r football_service.zip dist
