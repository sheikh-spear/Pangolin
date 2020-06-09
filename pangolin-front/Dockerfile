FROM node:latest

ADD ./ /usr/src/front

WORKDIR /usr/src/front

EXPOSE 4200/tcp

RUN npm i

RUN npm install -g @angular/cli@9.1.3


CMD ["ng", "serve", "--open"]