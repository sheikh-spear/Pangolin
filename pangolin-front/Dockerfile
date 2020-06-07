FROM node:latest
WORKDIR /usr/src/front

EXPOSE 4200
RUN npm i

FROM nginx:latest

RUN ng serve --open