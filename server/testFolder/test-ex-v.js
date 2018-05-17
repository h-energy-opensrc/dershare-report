var Docker = require('dockerode')


var docker = new Docker({
    socketPath: '/var/run/docker.sock'
  });
  
  docker.createContainer({
    Image: 'ubuntu',
    Cmd: ['/bin/ls', '/stuff'],
    'Volumes': {
      '/stuff': {}
    },
    'HostConfig': {
      'Binds': ['/Users/kruny1001/Desktop/idep-node/server/testFolder:/stuff']
    }
  }, function(err, container) {
    container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      tty: true
    }, function(err, stream) {
      stream.pipe(process.stdout);
      container.start(function(err, data) {
        console.log(data);
      });
    });
  });