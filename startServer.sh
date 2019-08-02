#/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.bashrc
nvm install --lts=Dubnium
nvm use lts/dubnium
npm install

PID=`ps | grep "node bin/www" | head -n 1 | awk '{print $1}'`
if [[ ! -z "$PID"]]; then
  kill -2 $PID
fi
nohup node bin/www & > nohup.out
