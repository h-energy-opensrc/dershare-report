const wsrpc = require('wsrpc')
const protobuf = require('protobufjs')
console.log(wsrpc, protobuf)
const proto = protobuf.loadSync(__dirname+'/my-service.proto')

const server = new wsrpc.Server({
    port: 4242,
    service: proto.lookupService('MyService')
})

server.implement('sayHello', async (request) => {
    return {text: `Hello ${ request.name }!`}
})