var Promise = require('bluebird')
var Docker = require('dockerode')
const async = require("async")
var fs = require('fs')
var docker = new Docker({
  socketPath: '/var/run/docker.sock',
  Promise : require('bluebird')
});

// filter by labels
var opts = {
  "limit": 3,
  //"filters": '{"label": ["staging","env=green"]}'
};

var outputDir = 'User1'
var defaultSettings = {
  Image: 'test-r-base',
  name: outputDir+'runner1',
  Tty: true,
  'Volumes': {
    '/usr/local/src/myscripts': {}
  },
  'HostConfig': {
    'Binds': [
      __dirname + outputDir + ':/usr/local/src/myscripts/output',
      __dirname + '/code:/usr/local/src/myscripts'
    ]
  },
}

var defaultSettings2 = {
  Image: 'test-r-base',
  name: outputDir+'runner2',
  Tty: true,
  "VolumesFrom":[outputDir+'runner1'] // This should be container name 
}

var defaultSettings3 = {
  Image: 'r-base',
  name: outputDir+'runner3',
  Tty: true,
  "VolumesFrom":[outputDir+'runner1'] // This should be container name 
}

var getList = function(){
  return new Promise((resolve, reject)=>{
    docker.listContainers(opts, function(err, containers) {
      resolve(containers)
    })
  })
}

function getContainers(containers){
  return new Promise((resolve, reject) =>{
    var promises = []
    containers.forEach((containerInfo)=>{
      promises.push(docker.getContainer(containerInfo.Id))
    })
    var getContainers = Promise.all(promises)
      .then(function(allResult) {
        resolve(allResult)
      })
  })
}

function stopAll(containers){
  return new Promise((resolve, reject)=> {
    var promises = []
    containers.forEach((container)=>{ promises.push(container.stop()) })
    var result = Promise.all(promises)
    resolve(result)
  })
}

function removeAll(containers){
  return new Promise((resolve, reject)=> {
    var promises = []
    containers.forEach((container)=>{ promises.push(container.remove()) })
    var result = Promise.all(promises)
    resolve(result)
  })
}

function initContainer(){
  console.log(0)
  return docker.createContainer(defaultSettings).then(function(container) {
    return container.start();
  })
}

function createContainer1(){
  console.log(1)
  return docker.createContainer(defaultSettings3).then(function(container) {
    return container.start();
  })
}

function createContainer2(){
  console.log(2)
  return docker.createContainer(defaultSettings2).then(function(container) {
    return container.start();
  })
}

function execContainer(fileName, container){
  container.exec({ Cmd: ['R', 'CMD', 'BATCH', '--save', '--slave', fileName], AttachStdin: false, AttachStdout: true }, function (err, exec) {
    exec.start({ hijack: true, stdin: true }, function (err, stream) {
      if (err) {
        console.log(err);
        return;
      };
      docker.modem.demuxStream(stream, process.stdout, process.stderr);
      exec.inspect(function (err, data) {
        if (err) return;
        console.log(data);
      });
    });
  });
}

function makestart(){
  async.series([
    function(callback) {
      setTimeout(function() {
        console.log("Task 1");
        initContainer()
        callback(null, 1);
      }, 300);
    },
    function(callback) {
      setTimeout(function() {
        createContainer1()
        console.log("Task 2");
        callback(null, 2);
      }, 200);
    },
    function(callback) {
      setTimeout(function() {
        createContainer2()
        console.log("Task 3");
        callback(null, 3);
      }, 100);
    }
    // ,
    // function(callback) {
    //   setTimeout(function() {
    //     console.log("Task 4");
    //     getList()
    //       .then(cnts => getContainers(cnts))
    //       .then(cnts => stopAll(cnts))
    //       .then(cnts => removeAll(cnts))
    //       .then(()=>console.log("** done"))
    //       .catch((e)=>console.log(e))
    //     callback(null, 4);
    //   }, 300);
    // }
  ], function(err, results) {
      console.log('err: ', err)
      console.log('result: ', results)
  });
}

var schedule = [
  {type:'serial', target:'main.R'},
  {type:'parallel', target:['test10.R', 'test25.R']},
  {type:'summarize', target:['test.R']}
]

function makeRun(){
  async.parallel([
    function(callback) {
        var container = docker.getContainer('49e52c836fc7');
        execContainer("main.R", container)
        callback(null, 10);
    },
  ], function(err, results) {
      console.log('err: ', err)
      console.log('result: ', results)
      console.log("done")
  });
}

function makeTest(){
  async.parallel([
    function(callback) {
        var container = docker.getContainer('49e52c836fc7');
        execContainer("test10.R", container)
        callback(null, 10);
    },
    function(callback) {
        var container = docker.getContainer('49e52c836fc7');
        execContainer("test25.R", container)
        callback(null, 25);
    },
    function(callback) {
      var container = docker.getContainer('49e52c836fc7');
      execContainer("test60.R", container)
      callback(null, 10);
  },
  function(callback) {
      var container = docker.getContainer('49e52c836fc7');
      execContainer("test40.R", container)
      callback(null, 25);
  },
  ], function(err, results) {
      console.log('err: ', err)
      console.log('result: ', results)
      console.log("done")
  });
}

//"docker exec -ti User1runner2 Rscript test.R"
// makestart()
// makeRun()
// makeStop()
//makeTest()

var container = docker.getContainer('49e52c836fc7');
execContainer("test.R", container)

// getList()
//   .then(cnts => getContainers(cnts))
//   .then(cnts => stopAll(cnts))
//   .then(cnts => removeAll(cnts))
//   .then(()=>console.log("** done"))
//   .catch((e)=>console.log(e))