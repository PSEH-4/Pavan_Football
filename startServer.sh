#/bin/bash

NODE_CHECK=`which node`
if [ -z "$NODE_CHECK" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
  source ~/.bashrc
  nvm install --lts=Dubnium
  nvm use lts/dubnium
  npm install
fi

sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

PID=`ps | grep "node bin/www" | head -n 1 | awk '{print $1}'`
if [[ ! -z "$PID" ]]; then
  kill -2 $PID
fi
export PORT=8080
nohup node bin/www > nohup.out &
