const { spawn } = require('child_process')
var Docker = require('dockerode')
var docker = new Docker({
  socketPath: '/var/run/docker.sock'
})

import { Router } from 'express'

const router = Router()

// {Tty: false, 
    // //     Image: 'r-cmd',
    // //     AttachStdin: false,
    // //     AttachStdout: true,
    // //     AttachStderr: true,
    // //     Tty: true,
    // //     // Cmd: ['R'],
    // //     OpenStdin: true,
    // //     StdinOnce: false
/* GET createContainer listing. */
router.get('/createContainer', function (req, res, next) {
  docker.createContainer({
      Image: 'r-base:latest',
      Name: 'rInterface',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['R'],
      Tty: true,
      OpenStdin: true,
      StdinOnce: true,
    })
    .then(function (container) {
      console.log("started")
      return container.start();
    }).then(function (container) {
      var result = {
        id:container.id, 
        output: container.resize({
            h: process.stdout.rows,
            w: process.stdout.columns
          })
      }
      res.json(result)
    })
})

router.get('/createContainer2', function (req, res, next) {
  var outputDir = "code/output";
  docker.createContainer({
      Image: 'kruny1001/webapp',
      Name: 'rInterface',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      'Volumes': {'/usr/local/src/myscripts': {}},
      'HostConfig': {
          'Binds': [
              '/Users/eunwooson/Downloads/idep-node/server/testFolder/'+ outputDir + ':/usr/local/src/myscripts/output',
              '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/idep:/usr/local/src/myscripts'
          ]
      },
      Cmd: ['R', '--save', 'load.R'],
      Tty: true,
      OpenStdin: true,
      StdinOnce: true,
    })
    .then(function (container) {
      console.log("started")
      return container.start();
    }).then(function (container) {
      var result = {
        id:container.id, 
        output: container.resize({
            h: process.stdout.rows,
            w: process.stdout.columns
          })
      }
      res.json(result)
    })
})

/* GET listContainer listing. */
router.get('/listContainers', function (req, res, next) {
  var containerIds = []
  docker.listContainers(function (err, containers) {
    containerIds.push(containers)
    if (containers != null) {
      containers.forEach(function (containerInfo) {});
      res.json(containerIds[0])
    } else
      res.json([])
  });
})

router.get('/removeAllContainers', function (req, res, next) {
  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      docker.getContainer(containerInfo.Id).stop();
    });
  });
  res.json({msg: "Done"})
})

// Attach 
router.get('/attach/:id', function (req, res, next) {
    // var container = docker.getContainer("12bd86fd5137")
    var container = docker.getContainer(req.params.id)
    console.log(container)
    container.exec({Cmd: ['R', 'CMD' ,'BATCH',  '--save', '--slave', 'test.R'], AttachStdin: false, AttachStdout: true}, function(err, exec) {
        exec.start({hijack: true, stdin: true}, function(err, stream) {
            if (err) { console.log(err)
                return; };
          docker.modem.demuxStream(stream, process.stdout, process.stderr);
          exec.inspect(function(err, data) {
            if (err) return;
            console.log(data);
            res.json({msg: data})
          });
        });
    });
    // container.stop()
    // container.attach({ stream: true, stdin: true, stdout: true, stderr: true}, function (err, stream) {
    //             stream.pipe(process.stdout);
    //             container.start(function (err, data) {
    //                 if(err) throw err;
    //                     stream.write('cat(a); a<-a+1\n');
    //             });

    //             container.modem.demuxStream(stream, process.stdout, process.stderr);
    //         });  
})

// Key Implementation 
router.get('/runScript/:id', function(req, res, next){
  const ls2 = spawn('docker',["exec", "-i", "b4be7749c35d", "R",  "--save", "--quiet"]);
  ls2.stdin.write('x<-x * 5+ a; print(x); print(x); png(file = "myplot.png", bg = "transparent");plot(x);dev.off()')
  ls2.stdin.end();
  var stdout = ""
  var stderr = ""
  ls2.stdout.on('data', (data) => {
    console.log("stdout")
    console.log(`${data.toString()}`);
    stdout = data.toString()
  });
  ls2.stderr.on('data', (data) => {
    console.log("error")
    console.log(`${data}`);
    stderr = data.toString()
  });
  ls2.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.json({stdout: stdout, stderr: stderr})
  });
})

router.get('/return/:id', function (req, res, next) {
    // var container = docker.getContainer("12bd86fd5137")
    var container = docker.getContainer(req.params.id)
    container.exec({Cmd: ['cat', 'test.Rout'], 
    AttachStdin: false, AttachStdout: true}, function(err, exec) {
        exec.start({hijack: true, stdin: true}, function(err, stream) {
            if (err) { console.log(err)
                return; };
          docker.modem.demuxStream(stream, process.stdout, process.stderr);
          stream.on('data', function(data) {
            //send the response of the cmd from Docker
            //Streamy.emit('result',{result: data.toString()}, from);
            res.json({msg: data})
          });
        //   exec.inspect(function(err, data) {
        //     if (err) return;
        //     res.json({msg: data})
        //   });
        });
    });
    // container.stop()
    // container.attach({ stream: true, stdin: true, stdout: true, stderr: true}, function (err, stream) {
    //             stream.pipe(process.stdout);
    //             container.start(function (err, data) {
    //                 if(err) throw err;
    //                     stream.write('cat(a); a<-a+1\n');
    //             });

    //             container.modem.demuxStream(stream, process.stdout, process.stderr);
    //         });
    
})

export default router
