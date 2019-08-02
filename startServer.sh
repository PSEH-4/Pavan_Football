#/bin/bash

npm install

PID=`ps | grep "node bin/www" | head -n 1 | awk '{print $1}'`
kill -2 $PID
nohup node bin/www & > nohup.out
