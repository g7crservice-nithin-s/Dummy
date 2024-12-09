###################
# BUILD FOR LOCAL DEVELOPMENT
####################

FROM node:20.12.0-alpine3.19 AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20.12.0-alpine3.19 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20.12.0-alpine3.19 AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env.prod ./.env.prod

CMD [ "node", "dist/main.js" ]