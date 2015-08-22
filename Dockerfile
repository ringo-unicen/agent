FROM node:0.10
MAINTAINER "Pablo Saavedra"

RUN mkdir /app
ADD modules /app/modules
ADD routes /app/routes
ADD package.json /app/package.json
ADD server.js /app/server.js

WORKDIR /app

RUN npm install --production

CMD node server.js

