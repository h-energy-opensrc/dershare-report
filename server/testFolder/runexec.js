// var Docker = require('dockerode')
// var docker = new Docker({socketPath: '/var/run/docker.sock'})

// // create a container entity. does not query API
// var container = docker.getContainer("50cbc4098aaf")

// var previousKey,
// CTRL_P = '\u0010',
// CTRL_Q = '\u0011';

// container.attach({ stream: true, stdin: true, stdout: true, stderr: true}, 
//     function (err, stream) {
//         if(err) throw err;
//         stream.pipe(process.stdout);
//         // Connect stdin
//         var isRaw = process.isRaw;
//         process.stdin.resume();
//         process.stdin.setEncoding('utf8');
//         process.stdin.setRawMode(true);
//         process.stdin.pipe(stream);

//         process.stdin.on('data', function(key) {
//         // Detects it is detaching a running container
//         // if (previousKey === CTRL_P && key === CTRL_Q) exit(stream, isRaw);
//         // previousKey = key;
//         });
// });

// // Exit container
// function exit (stream, isRaw) {
//     process.stdout.removeListener('resize', resize);
//     process.stdin.removeAllListeners();
//     process.stdin.setRawMode(isRaw);
//     process.stdin.resume();
//     stream.end();
//     process.exit();
//   }

// function resize (container) {
//     var dimensions = {
//       h: process.stdout.rows,
//       w: process.stderr.columns
//     };
//     if (dimensions.h != 0 && dimensions.w != 0) {
//       container.resize(dimensions, function() {});
//     }
// }

// // function runExec(container) {
// //     var options = {
// //         tty: true,
// //         Cmd: ['R'],
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

// // runExec(container)