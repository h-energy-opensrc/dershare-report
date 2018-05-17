var Docker = require('dockerode')

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

// docker.createContainer({
//   Image: 'test-r-base',
//   Tty: true,
//   'Volumes': {
//     '/usr/local/src/myscripts': {}
//   },
//   'HostConfig': {
//     'Binds': [
//       '/Users/kruny1001/Desktop/idep-node/server/testFolder/'+Math.random()+':/usr/local/src/myscripts/output', 
//       '/Users/kruny1001/Desktop/idep-node/server/testFolder/code:/usr/local/src/myscripts']
//   }
// }).then(function(container) {
//   return container.start();
// })

var outputDir = "First_Try"
const Setting = {
  Tty: true,
  'Volumes': {
    '/usr/local/src/myscripts': {}
  },
  'HostConfig': {
    'Binds': [
      '/Users/kruny1001/Desktop/idep-node/server/testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
      '/Users/kruny1001/Desktop/idep-node/server/testFolder/code:/usr/local/src/myscripts'
    ]
  }
}

docker.run('test-r-base', ['Rscript', 'main.R'], process.stdout, Setting)
.then(function (container) {
  return container.remove();
 })
.then(function () {
  console.log("output.R start")
  docker.run('test-r-base', ['Rscript', 'output.R'], process.stdout, Setting).then(function (container) {
  return container.remove();
  })
})
.then(function () {
  console.log("plot.R start")
  docker.run('test-r-base', ['Rscript', 'plot.R'], process.stdout, Setting).then(function (container) {
    return container.remove();
  })
})

// docker.run('test-r-base', ['Rscript', 'main.R'], process.stdout, Setting)
//   .then(function (container) {
//     console.log(container.output.StatusCode);
//     // return container.remove();
//     console.log("output.R start")
//     docker.run('test-r-base', ['Rscript', 'output.R'], process.stdout, Setting).then(function (container) {
//       console.log(container.output.StatusCode);
//       console.log("plot.R start")
//       docker.run('test-r-base', ['Rscript', 'plot.R'], process.stdout, Setting).then(function (container) {
//         console.log(container.output.StatusCode);
//       })
//     })
//   })


// .then(function(container) {
//   var options = {
//         Cmd: ['R', 'CMD', 'BATCH', 'main.R']
//   }
//   return new Promise((resolve, reject) => {
//     container.exec(options, (err, exec) => {
//       exec.start(function (err, stream) {
//         container.wait(function(err, data) {
//           if (err) reject(err.json.message)
//           console.log("done main.R")
//           resolve(container)
//         })
//       })
//     })
//   })
// }).then(function(container) {
//   console.log("output started")
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'output.R']
//   };
//   return new Promise((resolve, reject) => {
//     container.exec(options, (err, exec) => {
//       exec.start(function (err, stream) {
//         exec.inspect(function (err, data) {
//           if (err) reject(err.json.message)
//           console.log("done output.R")
//           resolve(container)
//         })
//       })
//     })
//   })
// }).then(function(container) {
//   console.log("plot started")
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'plot.R']
//   };
//   return new Promise((resolve, reject) => {
//     container.exec(options, (err, exec) => {
//       exec.start(function (err, stream) {
//         exec.inspect(function (err, data) {
//           if (err) reject(err.json.message)
//           console.log("done output.R")
//           resolve(container)
//         })
//       })
//     })
//   })
// })
// .then(function(container) {
//     return container.stop()
// }).then(function(container) {
//     return container.remove()
// }).then(function(){
//     console.log('container removed');
// }).catch(msg => {
//   console.log(msg)
// });



// function runTasks(){
//   var container = docker.getContainer('2eac1051ac4c')
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'main.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   return container.exec(options)
// }

// runTasks().then(function(){
//   var container = docker.getContainer('2eac1051ac4c')
//     var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'output.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   return container.exec(options)
// }).then(function(container){
//   var container = docker.getContainer('2eac1051ac4c')
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'plot.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   return container.exec(options)
// }).then(function(){
//   var container = docker.getContainer('2eac1051ac4c')
//   return container.stop()
// }).then(function(container){
//   var container = docker.getContainer('2eac1051ac4c')
//   return container.remove()
// }).then(function(data) {
//   console.log('container removed');
// }).catch(function(err) {
//   console.log(err);
// });

// container.exec(options, (err, exec)=>{
//     exec.start({hijack: true, stdin: true}, function(err, stream) {
//       // shasum can't finish until after its stdin has been closed, telling it that it has
//       // read all the bytes it needs to sum. Without a socket upgrade, there is no way to
//       // close the write-side of the stream without also closing the read-side!
//       // Fortunately, we have a regular TCP socket now, so when the readstream finishes and closes our
//       // stream, it is still open for reading and we will still get our results :-)
//       docker.modem.demuxStream(stream, process.stdout, process.stderr);
//     });
// })

// .then(function(container){
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'output.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   return container.exec(options)
// }).then(function(container){
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'plot.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   return container.exec(options)
// }).then(function(container){
//   container.stop()
// }).then(function(container) {
//   return container.remove();
// }).then(function(data) {
//   console.log('container removed');
// }).catch(function(err) {
//   console.log(err);
// });


// // , function (err, container) {
// //   container.start({}, function (err, data) {
// //     console.log(data)
// //     runExec(container);
// //   });
// // });

// // var container = docker.getContainer('1483f923e46e');
// // runExec(container);
// function runExec(container) {
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'main.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   container.exec(options, function (err, exec) {
//     if (err) return;
//     exec.start(function (err, stream) {
//       if (err) return;
//       container.modem.demuxStream(stream, process.stdout, process.stderr);
//       exec.inspect(function (err, data) {
//         if (err) return;
//         console.log("Done main.R");
//         runExec2(container)
//       });
//     });
//   });
// }

// function runExec2(container) {
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'output.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   container.exec(options, function (err, exec) {
//     if (err) return;
//     exec.start(function (err, stream) {
//       if (err) return;
//       container.modem.demuxStream(stream, process.stdout, process.stderr);
//       exec.inspect(function (err, data) {
//         if (err) return;
//         console.log("Done output.R");
//         runExec3(container)
//       });
//     });
//   });
// }

// function runExec3(container) {
//   var options = {
//     Cmd: ['R', 'CMD', 'BATCH', 'plot.R'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   container.exec(options, function (err, exec) {
//     if (err) return;
//     exec.start(function (err, stream) {
//       if (err) return;
//       container.modem.demuxStream(stream, process.stdout, process.stderr);
//       exec.inspect(function (err, data) {
//         if (err) return;
//         console.log("Done plot.R");
//         //readOutput(container)
//       });
//     });
//   });
// }


// // readOutput(container)
// function readOutput(container) {
//   var options = {
//     Cmd: ['cat', 'output/data.csv'],
//     AttachStdout: true,
//     AttachStderr: true
//   };
//   container.exec(options, function (err, exec) {
//     // console.log(err)
//     if (err) return;
//     exec.start(function (err, stream) {
//       // console.log(err)
//       if (err) return;
//       container.modem.demuxStream(stream, process.stdout, process.stderr);
//       exec.inspect(function (err, data) {
//         if (err) return;
//         console.log(data);
//         container
//       });
//     });
//   });

// }

// // docker.run('test-r-base', process.stdout,["R", "CMD", "BATCH", "output.R"], {
// //   'Volumes': {
// //     '/': {}
// //   }
// // });
