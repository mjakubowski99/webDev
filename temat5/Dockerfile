FROM node:10

WORKDIR /usr/src/docs

RUN npm install -g http-server
RUN npm install -g swagger

EXPOSE 10010

ENTRYPOINT swagger project start node_gallery