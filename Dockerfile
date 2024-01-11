FROM node:lts-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

ADD . /usr/src/app

RUN npm run build

ENV NODE_ENV development

EXPOSE 3001

RUN npm install pm2 -g
# CMD ["npm","start"]
CMD ["pm2-runtime", "dist/src/app.js"]