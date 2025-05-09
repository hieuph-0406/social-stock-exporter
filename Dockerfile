##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base
ENV YARN_VERSION=4.1.1

# Install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate

#####################
# BUILD BUILDER IMAGE
#####################

FROM base AS builder
WORKDIR /app

COPY . .
COPY package*.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --production
RUN yarn build

######################
# BUILD FOR PRODUCTION
######################

FROM node:20-alpine AS production
WORKDIR /app

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./

USER node

CMD [ "node", "dist/main.js" ]
