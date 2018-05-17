FROM node:9.4.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN apk update && apk upgrade && apk add git

COPY . /usr/src/app/
# Install required Node Packages
RUN npm install

# Build app
RUN npm run build

ENV HOST 0.0.0.0

# start command
# CMD [ "npm", "start" ]