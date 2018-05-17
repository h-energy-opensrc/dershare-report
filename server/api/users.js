import { Router } from 'express'
// const bluebird = require('bluebird')

const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' },
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})


// var Docker = require('dockerode')
// const concat = require('concat-stream')
// const docker = new Docker({socketPath: '/var/run/docker.sock'})

// /* GET users listing. */
// router.get('/containers', function (req, res, next) {
//     console.log("containers")
//     var containerIds = []
//     docker.listContainers(function (err, containers) {
//       containerIds.push(containers)
//         containers.forEach(function (containerInfo) {
//         });
//         res.json(containerIds)
//       });
// })


// router.get('/containerInfo', function (req, res, next) {
//   var container = docker.getContainer("a6d90fb84602d943431f04782c8b1b8c47ba50716ef9f7881c6e337187f1a93e")
//   var result;
//   function resize (container) {
//     var dimensions = {
//       h: process.stdout.rows,
//       w: process.stderr.columns
//     };
//     if (dimensions.h != 0 && dimensions.w != 0) {
//       container.resize(dimensions, function() {});
//     }
//   }
  
//   process.stdout.on('resize', function() {
//     resize(container);
//   });

//   // container.top({ps_args: 'aux'}, function(err, data) {
//   //   console.log(data);
//   // });
  
//   container.attach({ 
//     // hijack: true,
//     stream: true,
//     stdin: true,
//     stdout: true,
//     stderr: true},
//     async function (err, stream) {
//       console.log("attached")
//         if(err) throw err;
//         // stream.pipe(process.stdout);
//         stream.write('b<- c(1,2,3,4); plot(b)\n');
//         // // Connect stdin
//         var isRaw = process.isRaw;
//         // process.stdin.resume();
//         // process.stdin.setEncoding('utf8');
//         // process.stdin.pipe(stream);
//         // process.stdout.on('data', function(result){
//         //   console.log("++++")
//         //   console.log(result)
//         //   console.log("++++")
//         // })
//         stream.on('data', function (chunk) {
//           console.log("[chunk start]\n", chunk.toString('utf8'), "[chunk end]");
//           stream.end()
//           process.stdout.removeListener('resize', resize);
//           process.stdin.removeAllListeners();
//           process.stdin.resume();
//           res.json({result: ""})
//         });

//         // stream.on('error', (data) => {
//         //   console.log('in error:  ', data.toString());
//         // });
//         // stream.on('end', (data) => {
//         //   console.log('in end:  ', data);
//         //   res.json(data)
//         // });
//     });
  
// })


export default router
