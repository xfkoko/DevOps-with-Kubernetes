#!/bin/sh
URL=$(curl -Ls -o /dev/null -w %{url_effective} http://en.wikipedia.org/wiki/Special:Random)
echo "$URL"
curl -X POST http://ping-pong-svc:2346/todo -H "Content-Type: application/json" -d '{"value": "'"Read $URL"'"}'