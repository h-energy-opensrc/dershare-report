////////// Stream Need to be fixed
// Path Problem 
import axios from 'axios'

var fs = require('fs');
const async = require("async")
var Docker = require('dockerode');
var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';

var path = require('path')
var root = path.resolve(__dirname)

var outputTarget = "code/output/dershare";
var codedir = __dirname + "/../testFolder/"
var outputDir = root+ '/../testFolder/' + outputTarget + ':/usr/local/src/myscripts/output'
var inputDir = root+ '/../testFolder/' + 'code/dershare:/usr/local/src/myscripts'

outputDir = "/Users/eunwooson/Desktop/estimator/idep-node/server/socket/../testFolder/code/output/dershare:/usr/local/src/myscripts/output"
inputDir = "/Users/eunwooson/Desktop/estimator/idep-node/server/socket/../testFolder/code/dershare:/usr/local/src/myscripts"

var docker = new Docker({
  socketPath: socket
})

var attach_opts = {
  stream: true,
  stdin: true,
  stdout: true,
  stderr: true
}

var attach_opts2 = {
  stream: true,
  stdin: true,
  stdout: true,
  stderr: true
}

export function runTS(io) {
  io.on('connection', function (socket) {
    console.log("TS: ", __dirname);
    
    socket.on('disconnect', function () {
      console.log('user disconnected-TS');
    })

    socket.on('join-test-TS', function (data) {
      console.log(data);
      var codedir = __dirname + "/../testFolder/"
      console.log(codedir)
      socket.emit('messages', 'Hello from server-TS');
    })

    // Time Series Summary
    socket.on('ts-summary', function (input) {
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            // '/Users/eunwooson/Downloads/idep-node/server/testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
            outputDir,
            inputDir
            // root+ '/../testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
            // root+ '/../testFolder/' + 'code/dershare:/usr/local/src/myscripts',
            // '/Users/eunwooson/Downloads/idep-node/server/testFolder/' + 'code/dershare:/usr/local/src/myscripts'
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
      
      async.auto({
        pre_process: function (callback) {
            console.log("pre_process")
          docker.run('kruny1001/plumber', ['Rscript', '--vanilla', 'summary.R'
            , outputDir, inputDir
          ], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },

        email_link: ['pre_process', function (results, callback) {
          var fNames = ["maxByDays.png", "minByDays.png", "sumByDays.png"]
          fNames.forEach(fName =>{
            fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
              + fName , function (err, buf) {
              console.log(err)
              socket.emit('imagePre', {
                image: true,
                // id: input.id,
                type: "scatter",
                buffer: buf.toString('base64')
              });
            });
          })

          var tsNames = ["year_2015.png", "year_2016.png", "year_2017.png", "year_2018.png"]
          tsNames.forEach(fName =>{
            fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
              + fName , function (err, buf) {
              console.log(err)
              socket.emit('imageHeat', {
                image: true,
                // id: input.id,
                type: "scatter",
                buffer: buf.toString('base64')
              })
            })
          })
        //   const csv=require('csvtojson')
        //   csv()
        //   .fromFile(__dirname + '/../testFolder/code/output/dershare/fitmos.csv')
        //   .on('json',(jsonObj)=>{
        //     // combine csv header row and csv line to a json objects
        //     // jsonObj.a ==> 1 or 4
        //     console.log(jsonObj)
        //     socket.emit('prdCSV', {
        //       image: true,
        //       buffer: jsonObj
        //     });
        //   })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
      
    })


    socket.on('biz-summary', function (input) {
      console.log('biz-summary')
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            // '/Users/eunwooson/Downloads/idep-node/server/testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
            outputDir,
            inputDir
            // root+ '/../testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
            // root+ '/../testFolder/' + 'code/dershare:/usr/local/src/myscripts',
            // '/Users/eunwooson/Downloads/idep-node/server/testFolder/' + 'code/dershare:/usr/local/src/myscripts'
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
      
      async.auto({
        pre_process: function (callback) {
            console.log("pre_process")
          docker.run('kruny1001/plumber', ['Rscript', '--vanilla', 'biz-summary.R'
            , input.toString()
          ], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },

        email_link: ['pre_process', function (results, callback) {
          var fNames = ["maxByDays.png", "minByDays.png", "sumByDays.png"]
          fNames.forEach(fName =>{
            fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
              + fName , function (err, buf) {
              console.log(err)
              socket.emit('imagePre', {
                image: true,
                // id: input.id,
                type: "scatter",
                buffer: buf.toString('base64')
              });
            });
          })

          var tsNames = ["year_2015.png", "year_2016.png", "year_2017.png", "year_2018.png"]
          tsNames.forEach(fName =>{
            fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
              + fName , function (err, buf) {
              console.log(err)
              socket.emit('imageHeat', {
                image: true,
                // id: input.id,
                type: "scatter",
                buffer: buf.toString('base64')
              })
            })
          })
        //   const csv=require('csvtojson')
        //   csv()
        //   .fromFile(__dirname + '/../testFolder/code/output/dershare/fitmos.csv')
        //   .on('json',(jsonObj)=>{
        //     // combine csv header row and csv line to a json objects
        //     // jsonObj.a ==> 1 or 4
        //     console.log(jsonObj)
        //     socket.emit('prdCSV', {
        //       image: true,
        //       buffer: jsonObj
        //     });
        //   })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
      
    })

    socket.on('biz-analysis-dershare', function (input) {
      var outputDir2 = root+ '/../testFolder/' + outputTarget + ':/usr/src/app/output'
      var inputDir2 = root+ '/../testFolder/' + 'code/dershare:/usr/src/app'
      var dockerImg = 'py3-est'
      outputDir2 = "/Users/eunwooson/Desktop/estimator/idep-node/server/socket/../testFolder/code/output/dershare:/usr/src/app/output"
      inputDir2 = "/Users/eunwooson/Desktop/estimator/idep-node/server/socket/../testFolder/code/dershare:/usr/src/app"

      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/src/app': {}
        },
        'HostConfig': {
          'Binds': [outputDir2, inputDir2]
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
      
      async.auto({
        pre_process: function (callback) {
          console.log("pre_process")
          docker.run(dockerImg, ['python', 'biz-analysis-dershare.py'
            , input.toString()
          ], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },

        email_link: ['pre_process', function (results, callback) {

          
          var targetResult = __dirname + '/../testFolder/code/dershare/' + 'FeasibilityStudyResult.json'
          fs.readFile(targetResult, 'utf8', 
            function (err, data) {
              if (err) 
                console.log(err)
               // error handling
              var obj = JSON.parse(data);
              console.log(obj)
              socket.emit('feasible', {
                      image: true,
                      buffer: obj
              });
              fs.unlinkSync(targetResult);
          });

          
          // var fNames = ["maxByDays.png", "minByDays.png", "sumByDays.png"]
          // fNames.forEach(fName =>{
          //   fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
          //     + fName , function (err, buf) {
          //     console.log(err)
          //     socket.emit('imagePre', {
          //       image: true,
          //       // id: input.id,
          //       type: "scatter",
          //       buffer: buf.toString('base64')
          //     });
          //   });
          // })

          // var tsNames = ["year_2015.png", "year_2016.png", "year_2017.png", "year_2018.png"]
          // tsNames.forEach(fName =>{
          //   fs.readFile(__dirname + '/../testFolder/code/output/dershare/' 
          //     + fName , function (err, buf) {
          //     console.log(err)
          //     socket.emit('imageHeat', {
          //       image: true,
          //       // id: input.id,
          //       type: "scatter",
          //       buffer: buf.toString('base64')
          //     })
          //   })
          // })
        //   const csv=require('csvtojson')
        //   csv()
        //   .fromFile(__dirname + '/../testFolder/code/output/dershare/fitmos.csv')
        //   .on('json',(jsonObj)=>{
        //     // combine csv header row and csv line to a json objects
        //     // jsonObj.a ==> 1 or 4
        //     console.log(jsonObj)
        //     socket.emit('prdCSV', {
        //       image: true,
        //       buffer: jsonObj
        //     });
        //   })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
      
    })

    socket.on('ts-draw-plot', function (input) {
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            outputDir,
            inputDir
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

      async.auto({
        pre_process: function (callback) {
          docker.run('idepcompute', ['Rscript', '--vanilla', 'den.R', 
            input.id.toString(),
            input.width.toString(),
            input.height.toString(),
            input.maxY.toString(),
            input.maxX.toString(),
            input.cex.toString(),
            input.minDeg.toString(),
          ], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },
        email_link: ['pre_process', function (results, callback) {
          var fName = input.id +"_den.png"
          fs.readFile(__dirname + '/../testFolder/code/output/assessment/' + fName , function (err, buf) {
            console.log(err)
            socket.emit('imagePre', {
              image: true,
              id: input.id,
              type: "density",
              buffer: buf.toString('base64')
            });
          });
          const csv=require('csvtojson')
          csv()
          .fromFile(__dirname + '/../testFolder/code/output/assessment/fitmos.csv')
          .on('json',(jsonObj)=>{
            // combine csv header row and csv line to a json objects
            // jsonObj.a ==> 1 or 4
            console.log(jsonObj)
            socket.emit('prdCSV', {
              image: true,
              buffer: jsonObj
            });
          })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
    })

    /**
    socket.on('ts-draw-plot', function (input) {
      console.log(input);
      var outputDir = "code/output/assessment";
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            '/Users/eunwooson/Downloads/idep-node/server/testFolder/' + outputDir + ':/usr/local/src/myscripts/output',
            '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/assessment:/usr/local/src/myscripts'
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

      async.auto({
        pre_process: function (callback) {
          docker.run('idepcompute', ['Rscript', '--vanilla', 'den.R', 
            input.id.toString(),
            input.width.toString(),
            input.height.toString(),
            input.maxY.toString(),
            input.maxX.toString(),
            input.cex.toString(),
            input.minDeg.toString(),
          ], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },
        email_link: ['pre_process', function (results, callback) {
          var fName = input.id +"_den.png"
          fs.readFile(__dirname + '/../testFolder/code/output/assessment/' + fName , function (err, buf) {
            console.log(err)
            socket.emit('imagePre', {
              image: true,
              id: input.id,
              type: "density",
              buffer: buf.toString('base64')
            });
          });
          const csv=require('csvtojson')
          csv()
          .fromFile(__dirname + '/../testFolder/code/output/assessment/fitmos.csv')
          .on('json',(jsonObj)=>{
            // combine csv header row and csv line to a json objects
            // jsonObj.a ==> 1 or 4
            console.log(jsonObj)
            socket.emit('prdCSV', {
              image: true,
              buffer: jsonObj
            });
          })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
    })

    
    socket.on('ts-loadData-the-not', function () {
      console.log('loadData-the init')
      var outputDir = "code/output/thw/";
      var codedir = __dirname + "/../testFolder/"
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/output/thw' + ':/usr/local/src/myscripts/output',
            '/Users/eunwooson/Downloads/idep-node/server/testFolder/code/thw' + ':/usr/local/src/myscripts'
          ],
          AutoRemove: true
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
        next()
      };

      async.auto({
        loadData: function (callback) {
          console.log('in load_data: thw');
          docker.run('kruny1001/thw-r-base',
            ['Rscript', '--vanilla', 'product.R', "10"], myStream, Setting)
            .then(function (container) {
              setTimeout(function () {
                console.log("1", 'is Done')
                //callback(null, container);
                callback(null, 'data', 'converted to array');
              }, 300);
            })
        },
        email_link: ['loadData', function (results, callback) {
          console.log('in email_link', JSON.stringify(results))
          fs.readFile(__dirname + '/../testFolder/code/output/thw/year_2014.png', function (err, buf) {
            console.log(err)
            if (!err)
              socket.emit('imagePre', {
                image: true,
                buffer: buf.toString('base64')
              })
          });
          fs.readFile(__dirname + '/../testFolder/code/output/thw/year_2015.png', function (err, buf) {
            console.log(err)
            if (!err)
              socket.emit('imagePre', {
                image: true,
                buffer: buf.toString('base64')
              })
          });
          fs.readFile(__dirname + '/../testFolder/code/output/thw/year_2016.png', function (err, buf) {
            console.log(err)
            if (!err)
              socket.emit('imagePre', {
                image: true,
                buffer: buf.toString('base64')
              });
          });
          fs.readFile(__dirname + '/../testFolder/code/output/thw/year_2017.png', function (err, buf) {
            console.log(err)
            if (!err)
              socket.emit('imagePre', {
                image: true,
                buffer: buf.toString('base64')
              });
          });
          fs.readFile(__dirname + '/../testFolder/code/output/thw/montly_2017.png', function (err, buf) {
            console.log(err)
            if (!err)
              socket.emit('imageHeat', {
                image: true,
                buffer: buf.toString('base64')
              });
          });
          
          callback(null, 'filename');
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
    })

    socket.on('ts-productInfo-thw-not', function (input) {
      console.log(input)
      var outputDir = "code/output/thw";
      var codedir = __dirname + "/../testFolder/"
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            codedir + outputDir + ':/usr/local/src/myscripts/output',
            codedir + 'code/assessment:/usr/local/src/myscripts'
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

      async.auto({
        loadData: function(callback) {
            console.log('in load_data');
            docker.run('thw-r-base', ['Rscript', '--vanilla', 'prdInfo.R', input.year.toString(), input.month.toString()], myStream, Setting)
                .then(function (container) {
                    setTimeout(function(){
                        console.log("1", 'is Done')
                        //callback(null, container);
                        callback(null, 'data', 'converted to array');
                    }, 300);
            })
        },
        sendheatMap: ['loadData', function (results, callback) {
          var fName = "montly" + input.year.toString() + "_" + input.month.toString() + "_product.png"
          fs.readFile(__dirname + '/../testFolder/code/output/thw/' + fName , function (err, buf) {
            console.log(err)
            socket.emit('imageHeat', {
              image: true,
              buffer: buf.toString('base64')
            });
          });
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
    })

    socket.on('ts-prdId-thw-not', function (input) {
      console.log('prdId-thw')
      console.log(input)
      var outputDir = "code/output/thw";
      var codedir = __dirname + "/../testFolder/"
      const Setting = {
        Tty: true,
        'Volumes': {
          '/usr/local/src/myscripts': {}
        },
        'HostConfig': {
          'Binds': [
            codedir + outputDir + ':/usr/local/src/myscripts/output',
            codedir + 'code/assessment:/usr/local/src/myscripts'
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

      async.auto({
        pre_process: function (callback) {
          console.log('in get_data');
          docker.run('thw-r-base', ['Rscript', '--vanilla', 'productByID.R', input.ids.toString()], myStream, Setting)
            .then(function (container) {
              setTimeout(function(){
                  console.log("1", 'is Done')
                  //callback(null, container);
                  callback(null, 'data', 'converted to array');
              }, 300);
            })
        },
        email_link: ['pre_process', function (results, callback) {
         
          const csv=require('csvtojson')
          csv()
          .fromFile(__dirname + '/../testFolder/code/output/thw/prd.csv')
          .on('json',(jsonObj)=>{
            // combine csv header row and csv line to a json objects
            // jsonObj.a ==> 1 or 4
            console.log(jsonObj)
            socket.emit('prdCSV', {
              image: true,
              buffer: jsonObj
            });
          })
          callback(null, 'filename');
          // callback(null, {'file':results.write_file, 'email':'user@example.com'});
        }]
      }, function (err, results) {
        console.log('err = ', err);
        console.log('results = ', results);
      });
    })

    socket.on('ts-plot-idep-not', function (data) {
      var container = docker.getContainer(data.id);
      console.log("///", data.cmd);
      container.attach(attach_opts, function handler(err, stream) {
        process.stdin.pipe(stream);
        stream.write(data.cmd + "\n")
      })
      if (!data.cnn)
        container.attach(attach_opts2, function handler(err, stream) {
          container.modem.demuxStream(stream, process.stdout, process.stderr);
          stream.on('data', function (chunk) {
            socket.emit('docker_result_msg', {
              msg: chunk.toString('utf8'),
              cnn: true
            });
          });
        })
    })

    */

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

export default runTS
