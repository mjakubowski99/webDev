FROM node:12

WORKDIR /usr/src/app

COPY . ./

RUN npm install -g nodemon

EXPOSE 3000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint

RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

CMD ["nodemon"]


