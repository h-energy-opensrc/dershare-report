// var Docker = require('dockerode')
// var docker = new Docker({socketPath: '/var/run/docker.sock'})

// // create a container entity. does not query API
// var container = docker.getContainer('67f9227a9e10')

// // query API for container info
// container.inspect(function (err, data) {
//   console.log(data)
// })
// 
// // promises are supported
// docker.createContainer({
//     Image: 'r-cmd',
//     AttachStdout: true,
//     AttachStderr: true,
//     Tty: true,
//     Cmd: ['R'],
//     AttachStdin: true,
//     Privileged: false,
//     Tty: false,
//     OpenStdin: true,
//     StdinOnce: true,
//   }).then(function(container) {
//     return container.start()
//   }).then(function (container) {
//     container.attach({ stream: true, stdin: true, stdout: true, stderr: true}, function (err, stream) {
//         stream.pipe(process.stdout);
//         container.start(function (err, data) {
//             // if(err) throw err;
//             // stream.write('beep boop 1\n');
//         });
//     });
// });
  

// //   .then(function(container) {
// //     console.log("container ready")
// //     return container.resize({
// //       h: process.stdout.rows,
// //       w: process.stdout.columns
// //     })
// //   }).then(function(container){
// //     runExec(container)
// //   })

// // function runExec(container) {
// //     var options = {
// //         Cmd: ['/bin/bash', '-c', 'ping 8.8.8.8'],
// //         Env: ['VAR=ttslkfjsdalkfj'],
// //         AttachStdout: true,
// //         AttachStderr: true
// //     }   
// //     container.exec(options, function(err, exec) {
// //         if (err) return;
// //         exec.start(function(err, stream) {
// //             if (err) return;
// //             container.modem.demuxStream(stream, process.stdout, process.stderr)
// //             exec.inspect(function(err, data) {
// //                 if (err) return;
// //                 console.log(data);
// //             })
// //         })
// //     })
// // }


// // docker.createContainer(
    // {Tty: false, 
// //     Image: 'r-cmd',
// //     AttachStdin: false,
// //     AttachStdout: true,
// //     AttachStderr: true,
// //     Tty: true,
// //     // Cmd: ['R'],
// //     OpenStdin: true,
// //     StdinOnce: false
// // }, function(err, container) {
// //     container.exec({Cmd: ['R'], AttachStdin: true, AttachStdout: true}, function(err, exec) {
// //       exec.start({hijack: true, stdin: true}, function(err, stream) {
// //         // shasum can't finish until after its stdin has been closed, telling it that it has
// //         // read all the bytes it needs to sum. Without a socket upgrade, there is no way to
// //         // close the write-side of the stream without also closing the read-side!
// //         // fs.createReadStream('node-v5.1.0.tgz', 'binary').pipe(stream);
  
// //         // Fortunately, we have a regular TCP socket now, so when the readstream finishes and closes our
// //         // stream, it is still open for reading and we will still get our results :-)
// //         docker.modem.demuxStream(stream, process.stdout, process.stderr);
// //       });
// //     });
// //   });

    
// //   .then(function(container) {
// //     return container.stop()
// //   }).then(function(container) {
// //     return container.remove()
// //   }).then(function(data) {
// //     console.log('container removed')
// //   }).catch(function(err) {
// //     console.log(err)
// //   })

// // var docker4 = new Docker({host: '127.0.0.1', port: 3000}) //defaults to http

// //protocol http vs https is automatically detected
// // var docker5 = new Docker({
// //   host: '192.168.1.10',
// //   port: process.env.DOCKER_PORT || 2375,
// //   ca: fs.readFileSync('ca.pem'),
// //   cert: fs.readFileSync('cert.pem'),
// //   key: fs.readFileSync('key.pem'),
// //   version: 'v1.25' // required when Docker >= v1.13, https://docs.docker.com/engine/api/version-history/
// // })

// // var docker6 = new Docker({
// //   protocol: 'https', //you can enforce a protocol
// //   host: '192.168.1.10',
// //   port: process.env.DOCKER_PORT || 2375,
// //   ca: fs.readFileSync('ca.pem'),
// //   cert: fs.readFileSync('cert.pem'),
// //   key: fs.readFileSync('key.pem')
// // })

// // //using a different promise library (default is the native one)
// // var docker7 = new Docker({
// //   Promise: require('bluebird')
// //   //...
// // })