FROM node

WORKDIR /abb

COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/server/package.json ./packages/server/
COPY ./packages/common/package.json ./packages/common/

RUN yarn install --production

COPY ./packages/server/dist ./packages/server/dist
COPY ./packages/server/.env.prod ./packages/server/.env
COPY ./packages/common/dist ./packages/common/dist
COPY ./ormconfig.json .

WORKDIR /abb/packages/server

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"] 