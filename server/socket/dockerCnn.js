import axios from 'axios'
var Docker = require('dockerode');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3001

var docker = new Docker({
  socketPath: socket
});

var attach_opts = {stream: true,stdin: true,stdout: true,stderr: true};
var attach_opts2 = {stream: true,stdin: true,stdout: true,stderr: true};

export function start(io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('join', function (data) {
      console.log(data);
      socket.emit('messages', 'Hello from server');
    });
    socket.on('getDocker', function (data) {
      console.log(data);
      axios.get('api/createContainer2').then(function (response) {
        console.log(response.data)
        socket.emit('docker_result_msg', {
          msg: "success"
        });
      })
    });
    socket.on('runScript-idep', function (data) {
      var container = docker.getContainer(data.id);
      console.log("///", data.cmd);
      container.attach(attach_opts, function handler(err, stream) {
        process.stdin.pipe(stream);
        stream.write(data.cmd + "\n")
      })
      if(!data.cnn)
        container.attach(attach_opts2, function handler(err, stream) {
          container.modem.demuxStream(stream, process.stdout, process.stderr);
          stream.on('data', function (chunk) {
            socket.emit('docker_result_msg', {msg: chunk.toString('utf8'), cnn:true});
          });
        })
    });

    
  });

}

// Resize tty
function resize(container) {
  console.log(process.stdout.rows)
  var dimensions = {
    h: process.stdout.rows,
    w: process.stderr.columns
  };
  if (dimensions.h != 0 && dimensions.w != 0) {
    container.resize(dimensions, function () {});
  }
}

function exit2(stream, isRaw) {
  process.stdout.removeListener('resize', resize);
  // process.stdin.removeAllListeners();
  // process.stdin.setRawMode(isRaw);
  // process.stdin.resume();
  stream.end();
  process.exit();
}

export default start
