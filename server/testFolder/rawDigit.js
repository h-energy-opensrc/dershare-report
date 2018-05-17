var Docker = require('dockerode')
var fs = require('fs')
var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

// Example of How to cerate TSNE Data
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

var Writable = require('stream').Writable;
var myStream = new Writable();
var output = ''

myStream._write = function write(doc, encoding, next) {
  var StringDecoder = require('string_decoder').StringDecoder;
  var decoder = new StringDecoder('utf8');
  var result = decoder.write(doc);
  output += result;
  console.log(result)
  next()
  // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
};

function handler(error, data, container) {
  if (error) {
    console.log({
      'status': 'error',
      'message': error
    });
    reject(error)
  }
  resolve(output);
};

docker.run('test-r-base', ['Rscript', '--vanilla', 'main.R'], myStream, Setting)
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
    docker.run('test-r-base', ['Rscript', 'plot.R'], process.stdout, Setting)
        .then(function (container) {
            return container.remove();
        })
  }).then(function () {
    res.json({msg: output})
})

// router.get('/getTSNE', function (req, res, next) {
//   const filePath = __dirname + '/../testFolder/First_Try/data.csv'
//   var stat = fs.statSync(filePath);
//   res.setHeader('Content-Length', stat.size);
//   res.setHeader('Content-Type', 'text/csv');
//   res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
//   var readStream = fs.createReadStream(filePath);
//   readStream.pipe(res);
// })

// router.get('/getTSNEImg', function (req, res, next) {
//   const filePath = __dirname + '/../testFolder/First_Try/plot.png'
//   var img = fs.readFileSync(filePath);
//   var stat = fs.statSync(filePath);
//   res.setHeader('Content-Length', stat.size);
//   // res.setHeader('Content-Disposition', 'attachment; filename=plot.png');
//   res.writeHead(200, {
//     'Content-Type': 'image/png'
//   });
//   res.end(img, 'binary');
// })

// router.get('/getTSNEImg2', function (req, res, next) {
//   const filePath = __dirname + '/../testFolder/First_Try/kmean_all.png'
//   var img = fs.readFileSync(filePath);
//   var stat = fs.statSync(filePath);
//   res.setHeader('Content-Length', stat.size);
//   // res.setHeader('Content-Disposition', 'attachment; filename=plot.png');
//   res.writeHead(200, {
//     'Content-Type': 'image/png'
//   });
//   res.end(img, 'binary');
// })
