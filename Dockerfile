FROM node:10

ARG FOLDER

COPY package*.json ./
COPY ${FOLDER}/index.js ./js/index.js
COPY ./config/config.js ./config/config.js

RUN npm install

CMD ["node", "./js/index.js"]