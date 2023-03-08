
# Build UI component
FROM node:18.14.2-alpine3.17 AS ui_base

# Builder
FROM ui_base as builder
ARG NEXT_PUBLIC_SLOT_INTERVAL
ARG NEXT_PUBLIC_SERVER

# Installing build dependencies
RUN apk update && apk upgrade && apk add bash

WORKDIR /bookie
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying source folders
COPY next.config.js tsconfig.json constants.tsx ./
COPY app ./app
COPY components ./components
COPY contexts ./contexts
COPY libs ./libs
COPY hooks ./hooks
COPY public ./public

ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_SLOT_INTERVAL $NEXT_PUBLIC_SLOT_INTERVAL
ENV NEXT_PUBLIC_SERVER $NEXT_PUBLIC_SERVER

# Build component
RUN npm run build

# Prepare production component
FROM ui_base as ui

# Configure production environment
RUN mkdir -p /home/node/bookie && \
    npm install -g pm2 next
WORKDIR /home/node/bookie

USER node
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /bookie/public ./public
COPY --from=builder --chown=node:node /bookie/.next/standalone ./
COPY --from=builder --chown=node:node /bookie/.next/static ./.next/static

# Serve UI
CMD ["pm2-runtime", "server.js"]