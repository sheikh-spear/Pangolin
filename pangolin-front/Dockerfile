FROM node:latest

ADD ./ /usr/src/front
WORKDIR /usr/src/front

EXPOSE 4200

RUN npm install -g @angular/cli

RUN npm i

RUN npm audit fix

RUN ls -l

RUN cd /usr/src/front && ng serve