var Docker = require('dockerode')
const async = require("async")

var docker = new Docker({ socketPath: '/var/run/docker.sock' });

import { Router } from 'express'
const router = Router()

// Example of How to cerate TSNE Data
router.get('/unsupervised', function (req, res, next) {
    var outputDir = "First_Try";
    const Setting = {
        Tty: true,
        'Volumes': {
            '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
            'Binds': [
                '/Users/eunwooson/Downloads/idep-node/server/testFolder/'+ outputDir + ':/usr/local/src/myscripts/output',
                '/Users/eunwooson/Downloads/idep-node/server/testFolder/code:/usr/local/src/myscripts'
            ]
        }
    }

    var Writable = require('stream').Writable;
    var myStream = new Writable();
    var output = ''

    myStream._write = function write(doc, encoding, next) {
        var StringDecoder = require('string_decoder').StringDecoder
        var decoder = new StringDecoder('utf8')
        var result = decoder.write(doc)
        output += result;
        console.log(result)
        next()
        // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
    };

    async.auto({
        get_data: function(callback) {
            console.log('in get_data');
            docker.run('test-r-base', ['Rscript', '--vanilla', 'asyncT.R', "1"], myStream, Setting).then(function (container) {
              setTimeout(function(){
                console.log("1", 'is Done')
                //callback(null, container);
                callback(null, 'data', 'converted to array');
              }, 300);
            })
            // async code to get some data
        },
        make_folder: function(callback) {
            console.log('in make_folder');
            // async code to create a directory to store a file in
            // this is run at the same time as getting the data
            docker.run('test-r-base', ['Rscript', '--vanilla', 'asyncT.R', "2"], myStream, Setting).then(function (container) {
              setTimeout(function(){
                console.log("2", 'is Done')
                //callback(null, container);
                callback(null, 'folder');
              }, 300);
            })  
        },
        make_folder3: function(callback) {
          console.log('in make_folder');
          // async code to create a directory to store a file in
          // this is run at the same time as getting the data
          docker.run('test-r-base', ['Rscript', '--vanilla', 'asyncT.R', "3"], myStream, Setting).then(function (container) {
            setTimeout(function(){
              console.log("3", 'is Done')
              //callback(null, container);
              callback(null, 'folder3');
            }, 300);
          })  
        },
        write_file: ['get_data', 'make_folder', function(results, callback) {
            console.log('in write_file', JSON.stringify(results));
            // once there is some data and the directory exists,
            // write the data to a file in the directory
            console.log("3", 'write file done')
            callback(null, 'filename');
        }],
        email_link: ['write_file', function(results, callback) {
            console.log('in email_link', JSON.stringify(results));
            // once the file is written let's email a link to it...
            // results.write_file contains the filename returned by write_file.
            callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
        }, function(err, results) {
            console.log('err = ', err);
            console.log('results = ', results);
        });
    res.json({msg: 'Accepted'})
})


router.get('/supervised', function (req, res, next) {

})

router.get('/model-test', function (req, res, next) {
  const filePath = __dirname + '/../testFolder/First_Try/data.csv'
  var stat = fs.statSync(filePath);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
  var readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
})


export default router
