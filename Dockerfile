FROM node:19-alpine3.16
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
ENV SERVER_PORT 3000
EXPOSE $SERVER_PORT
CMD ["npm", "run","start:dev"]