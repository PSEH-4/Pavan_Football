#/bin/bash

npm install

PID=`ps | grep "node bin/www" | head -n 1 | awk '{print $1}'`
if [[ ! -z "$PID"]]; then
  kill -2 $PID
fi
nohup node bin/www & > nohup.out
