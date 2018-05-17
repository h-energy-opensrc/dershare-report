# idep-node

> compute container web application 

This is a proof of concept. We applied the docker container as compute engine. Each task can be done by docker container scheduler. Result can be retrieve by web soceket. Client side can talk with server via web socket. 



## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```


# Docker stop and remove all containers 
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

## volume 
## Promise Problem 
https://github.com/apocas/dockerode/issues/272


# Apply 
https://demo.bpmn.io/s/start
