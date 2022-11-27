FROM node

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "node", "server.js" ]