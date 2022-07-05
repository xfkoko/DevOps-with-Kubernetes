FROM alpine:latest

WORKDIR /usr/src/app

RUN apk --no-cache add curl

COPY . .

CMD ["./postToDo.sh"]