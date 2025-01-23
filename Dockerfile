##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

RUN apk add --no-cache bash

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM base As development
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

COPY --chown=node:node package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

#####################
# BUILD BUILDER IMAGE
#####################

FROM base AS builder
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/src ./src
COPY --chown=node:node --from=development /usr/src/app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /usr/src/app/nest-cli.json ./nest-cli.json

RUN npm run build

# Removes unnecessary packages adn re-install only production dependencies
ENV NODE_ENV production
RUN npm prune --prod
RUN npm install --prod

USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:20-alpine AS production
WORKDIR /usr/src/app


# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json ./

USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
