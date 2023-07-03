FROM node:18

WORKDIR /app

COPY *.json *.yml *.lock /app/
COPY packages /app/packages
COPY script /app/script

RUN CI=1 . script/bootstrap
RUN yarn build:api

CMD yarn start:api
