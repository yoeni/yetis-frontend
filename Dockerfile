FROM node:alpine

WORKDIR /usr/app
COPY ./package*.json ./
RUN npm install
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
COPY ./ ./
EXPOSE 3000
USER node

CMD [ "npm", "--", "start" ]
