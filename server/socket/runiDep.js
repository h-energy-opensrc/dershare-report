// Stream Need to be fixed

import axios from 'axios'
var fs = require('fs')
const async = require('async')
var Docker = require('dockerode')
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'

var docker = new Docker({
  socketPath: socket
});

var attach_opts = {stream: true,stdin: true,stdout: true,stderr: true};
var attach_opts2 = {stream: true,stdin: true,stdout: true,stderr: true};

export function runiDep (io) {
  io.on('connection', function (socket) {
    socket.on('disconnect', function () {
      console.log('user disconnected-idep')
    });
    socket.on('join-test-idep', function (data) {
      console.log(data);
      socket.emit('messages', 'Hello from server');
    });
    socket.on('getDocker-compute-idep', function (data) {
      console.log(data);
      axios.get('api/createContainer').then(function (response) {
        ref.push(response.data)
        console.log(response.data)
        socket.emit('docker_result_msg', {
          msg: "success"
        });
      })
    });
    socket.on('loadData-idep', function(){
        console.log('loadData-idep init')
        var outputDir = "code/output";
        const Setting = {
            Tty: true,
            'Volumes': {'/usr/local/src/myscripts': {}},
            'HostConfig': {
                'Binds': [
                    '/Users/eunwooson/Downloads/idep-node/server/testFolder/'+ outputDir + ':/usr/local/src/myscripts/output',
                    '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/idep:/usr/local/src/myscripts'
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
            socket.emit('docker_result_msg', {
                msg: result
            });
            next()
        };

        var myStream2 = new Writable();
        var output2 = ''
    
        myStream2._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream3 = new Writable();
        var output2 = ''
    
        myStream3._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream4 = new Writable();
        var output2 = ''
    
        myStream4._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            next()
        };

        async.auto({
            loadData: function(callback) {
                console.log('in load_data');
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'load.R', "10"], myStream, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("1", 'is Done')
                            //callback(null, container);
                            callback(null, 'data', 'converted to array');
                        }, 300);
                })
            },
            transform: ['loadData', function(results, callback) {
                // console.log(results)
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'transform.R', "2"], myStream2, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("2", 'is Done')
                            //callback(null, container);
                            callback(null, 'folder');
                        }, 300);
                })
            }],
            heatMap: ['loadData','transform', function(results, callback) {
                // console.log(results)
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'heatmap.R', "2"], myStream3, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("2", 'is Done')
                            //callback(null, container);
                            callback(null, 'folder');
                        }, 300);
                })
            }],
            pca: ['loadData','transform','heatMap', function(results, callback) {
                // console.log(results)
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'pca.R', "2"], myStream4, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("2", 'is Done')
                            //callback(null, container);
                            callback(null, 'folder');
                        }, 300);
                })
            }],
            sendheatMap: ['heatMap', function(results, callback) {
                fs.readFile(__dirname + '/../testFolder/code/output/hierarchical_clustering_tree.png', function(err, buf){
                    console.log(err)
                    if(!err)
                        socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/CorrelationMatrix.png', function(err, buf){
                    console.log(err)
                    if(!err)
                        socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/staticHeatmap.png', function(err, buf){
                    console.log(err)
                    if(!err)
                        socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
            }],
            sendPca: ['pca', function(results, callback) {
                fs.readFile(__dirname + '/../testFolder/code/output/pca.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/pca_mds.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/pca_mds2.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
            }],
            email_link: ['transform', function(results, callback) {
                console.log('in email_link', JSON.stringify(results))
                fs.readFile(__dirname + '/../testFolder/code/output/barplot1.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePre', { image: true, buffer: buf.toString('base64') })
                });
                fs.readFile(__dirname + '/../testFolder/code/output/dist.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePre', { image: true, buffer: buf.toString('base64') })
                });
                fs.readFile(__dirname + '/../testFolder/code/output/distbox.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePre', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/scatter.png', function(err, buf){
                    console.log(err)
                    if(!err)
                    socket.emit('imagePre', { image: true, buffer: buf.toString('base64') });
                });
                callback(null, 'filename');
            }]
            }, function(err, results) {
                console.log('err = ', err);
                console.log('results = ', results);
            });
    })

    socket.on('loadData-idep-plots', function(){
        console.log('loadData-idep init')
        var outputDir = "code/output";
        const Setting = {
            Tty: true,
            'Volumes': {
                '/usr/local/src/myscripts': {}
            },
            'HostConfig': {
                'Binds': [
                    '/Users/eunwooson/Downloads/idep-node/server/testFolder/'+ outputDir + ':/usr/local/src/myscripts/output',
                    '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/idep:/usr/local/src/myscripts'
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
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream2 = new Writable();
        var output2 = ''
    
        myStream2._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream3 = new Writable();
        var output2 = ''
    
        myStream3._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream4 = new Writable();
        var output2 = ''
    
        myStream4._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            next()
        };

        async.auto({
            // loadData: function(callback) {
            //     console.log('in load_data');
            //     docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'load.R', "10"], myStream, Setting)
            //         .then(function (container) {
            //             setTimeout(function(){
            //                 console.log("1", 'is Done')
            //                 //callback(null, container);
            //                 callback(null, 'data', 'converted to array');
            //             }, 300);
            //     })
            // },
            // transform: ['loadData', function(results, callback) {
            //     // console.log(results)
            //     docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'transform.R', "2"], myStream2, Setting)
            //         .then(function (container) {
            //             setTimeout(function(){
            //                 console.log("2", 'is Done')
            //                 //callback(null, container);
            //                 callback(null, 'folder');
            //             }, 300);
            //     })
            // }],
            heatMap: function(callback) {
                // console.log(results)
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'heatmap.R', "2"], myStream3, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("2", 'is Done')
                            //callback(null, container);
                            callback(null, 'folder');
                        }, 300);
                })
            },
            pca: function(callback) {
                // console.log(results)
                docker.run('kruny1001/webapp', ['Rscript', '--vanilla', 'pca.R', "2"], myStream4, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("2", 'is Done')
                            //callback(null, container);
                            callback(null, 'folder');
                        }, 300);
                })
            },
            sendheatMap: ['heatMap', 'pca', function(results, callback) {
                fs.readFile(__dirname + '/../testFolder/code/output/hierarchical_clustering_tree.png', function(err, buf){
                    console.log(err)
                    socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/CorrelationMatrix.png', function(err, buf){
                    console.log(err)
                    if(!err)
                        socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/staticHeatmap.png', function(err, buf){
                    console.log(err)
                    socket.emit('imageHeat', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/pca.png', function(err, buf){
                    console.log(err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/pca_mds.png', function(err, buf){
                    console.log(err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/code/output/pca_mds2.png', function(err, buf){
                    console.log(err)
                    socket.emit('imagePca', { image: true, buffer: buf.toString('base64') });
                });
            }]
            }, function(err, results) {
                console.log('err = ', err);
                console.log('results = ', results);
            });
    })
    socket.on('transform-idep', function(){
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
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };

        var myStream2 = new Writable();
        var output2 = ''
    
        myStream2._write = function write(doc, encoding, next) {
            var StringDecoder = require('string_decoder').StringDecoder
            var decoder = new StringDecoder('utf8')
            var result = decoder.write(doc)
            socket.emit('docker_result_msg', {
                msg: result
            });
            // output += result;
            // console.log(result)
            next()
            // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
        };
    
        async.auto({
            pre_process: function(callback) {
                console.log('in get_data');
                docker.run('test-r-base', ['Rscript', '--vanilla', 'main.R', "1"], myStream, Setting)
                    .then(function (container) {
                        setTimeout(function(){
                            console.log("1", 'is Done')
                            //callback(null, container);
                            callback(null, 'data', 'converted to array');
                        }, 300);
                    })
            },
            // make_folder: function(callback) {
            //     console.log('in make_folder');
            //     // async code to create a directory to store a file in
            //     // this is run at the same time as getting the data
            //     docker.run('test-r-base', ['Rscript', '--vanilla', 'plot.R', "2"], myStream, Setting).then(function (container) {
            //       setTimeout(function(){
            //         console.log("2", 'is Done')
            //         //callback(null, container);
            //         callback(null, 'folder');
            //       }, 300);
            //     })  
            // },
            // make_folder3: function(callback) {
            //   console.log('in make_folder');
            //   // async code to create a directory to store a file in
            //   // this is run at the same time as getting the data
            //   docker.run('test-r-base', ['Rscript', '--vanilla', 'asyncT.R', "3"], myStream, Setting).then(function (container) {
            //     setTimeout(function(){
            //       console.log("3", 'is Done')
            //       //callback(null, container);
            //       callback(null, 'folder3');
            //     }, 300);
            //   })  
            // },
            draw_plot: ['pre_process', function(results, callback) {
                // console.log(results)
                docker.run('test-r-base', ['Rscript', '--vanilla', 'plot.R', "2"], myStream2, Setting).then(function (container) {
                  setTimeout(function(){
                    console.log("2", 'is Done')
                    //callback(null, container);
                    callback(null, 'folder');
                  }, 300);
                })
            }],
            email_link: ['draw_plot', function(results, callback) {
                console.log('in email_link', JSON.stringify(results));
                // once the file is written let's email a link to it...
                // results.write_file contains the filename returned by write_file.
                fs.readFile(__dirname + '/../testFolder/First_try/kmean_all.png', function(err, buf){
                    // it's possible to embed binary data
                    // within arbitrarily-complex objects
                    console.log(err)
                    socket.emit('image', { image: true, buffer: buf.toString('base64') });
                });
                fs.readFile(__dirname + '/../testFolder/First_try/plot.png', function(err, buf){
                    // it's possible to embed binary data
                    // within arbitrarily-complex objects
                    console.log(err)
                    socket.emit('image', { image: true, buffer: buf.toString('base64') });
                });
                callback(null, 'filename');
                // callback(null, {'file':results.write_file, 'email':'user@example.com'});
            }]
            }, function(err, results) {
                console.log('err = ', err);
                console.log('results = ', results);
            });
    });
    socket.on('plot-idep', function (data) {
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
  stream.end();
  process.exit();
}

export default runiDep
