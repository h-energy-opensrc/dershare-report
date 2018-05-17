<template>
  <section class="main">
  <!-- <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" /> -->
    <h1 class="f2 code title underline">iDEP ver 2.0.12</h1>
    
    <article class="cf">
      <div style="" class="fl w-100 bg-near-white">
        <div class="bg-near-white pa5 ma2" style="max-width: 750px; margin: 0px auto">
        <div>Number of Running Containers: {{containers.length}}</div>
        <ul class="list">
          <li style="text-align=left;" 
              v-for="(container, index) in containers" :key="index">
            <hr/>
            <!-- 
              <div><strong>ID:</strong> {{container.Id}}</div>
              <div><strong>Names:</strong> {{container.Names}}</div>
            -->
            <div><strong>Images:</strong> {{container.Image}}</div>
            <div><strong>State:</strong> {{container.State}}</div>

            <button @click="attach(container.Id)">Log</button>
            <button @click="resultBack(container.Id)">return </button>
            <button @click="runScript(container.Id)">Run Script</button>
            <button @click="connR(container.Id)">Connect R Session</button>
          </li>
        </ul>
        <!-- <pre style="f6 width:150px; height:20px; position:absolute; top:0; right: 43px;"> {{msg}}</pre>
        <pre style="f6 width:150px; height:20px; position:absolute; top:25px; right: 43px;"> {{msg_docker}}</pre> -->
      </div>
      </div>
    </article>

    <div class="bg-near-white" style=" text-align: center;">
      <button @click="getDockerContainer()"> Get Docker </button>
      <button @click="listContainers()"> listContainers </button>
      <button @click="createDocker()">Create Docker</button>
      <button @click="removeAllContainers()">Remove All Containers</button>
      <button @click="logInformation()">connect socket</button>
    </div>

    <article v-if="crntContainerID!=''" class="cf">
      <div style="position: relative;" class="fl w-50 bg-near-white tc">
        <h1>R Code</h1>
        <textarea class="tracked code" style="font-size:11px; 
          max-width: 100%; padding:15px; color:white; 
          width:100%; background: #353131; height:1300px;" 
          v-model="cmd" placeholder="Type R code"></textarea>
        <button style="position: absolute;top: 10px;right: 10px;font-wegiht:bold; font-size:18px;" @click="runScriptR()"> Run R</button>
      </div>
      <div style="" class="fl w-50 bg-light-gray tc">
        <h1>R console</h1>
        <pre id="output" class="tracked code" 
        style="text-align: left; max-width: 100%; padding:15px; 
          color:white; overflow-y: auto !important; 
          font-size:11px; font-weight: bold; width:100%; background: #353131; height:1300px;" >
          {{msg_docker_result}}
        </pre>
      </div>
    </article>

    <br/>

    <div class="pa3">
      <pre>
        Docker workflow
        1. Create Docker Container 
        2. Copy target File 
        3. Execute target File 
        4. Read output 
        5. Destroy Container
      </pre>
      <hr/>
      <p> 
        iDEP is complex Shiny web application. The app requires numerous resources in order to complete each tasks.
        This approach is allow to have a container for each task and It runs pareller fashion. 
      </p>
      <ul>
        <li> 1/1/2018: Enable to create docker by websocket </li>
        <li> 1/1/2018: Attach and Detach should be reliable </li>
        <li> One user must have at most 5 docker containers </li>
      </ul>
    </div>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import io from 'socket.io-client';
import Header from '~/components/Header'
export default {
  components: {
    'main-header': Header
  },
  async asyncData () {
    let dockerData = await axios.get('api/listContainers')
    return { containers: dockerData.data}
  },
  mounted() {     
    var vm = this;
    vm.socket = io.connect(vm.host)
    vm.socket.on('connect', function(data){
      vm.socket.emit('join', 'Hello World from client');
    })
    vm.socket.on('messages', function(data) {
      vm.msg = data;
    });
    vm.socket.on('docker_msg', function(data){
      vm.msg_docker = data;
    })
    vm.socket.on('docker_result_msg', function(data){
      vm.cnn = data.cnn
      vm.msg_docker_result += data.msg.replace(/^\s+|\s+$/g,'') + "\n";
      var pre = document.querySelector('#output')
      setTimeout(function(){ pre.scrollTo(0, document.querySelector('#output').scrollHeight) }, 500);
    })
  },
  head () {
    return {
      title: 'Users'
    }
  },
  data() {
    return{ 
      //host: 'http://bioinformatics.sdstate.edu:8000',
      host: 'localhost:3001',
      crntContainerID:"", decoded: "", cnn:false, msg:"", msg_docker:{}, socket:{}, msg_docker_result:"", cmd:""}
  },
  methods: {

    connR(id){
      var vm = this;
      vm.crntContainerID = id
      var cmd = "print('connected to "+ id+"')"
      vm.socket.emit('runScript', {cmd: cmd, cnn: vm.cnn, id: id});
    },
    listenContainers() {
      var vm = this;
      axios.get('/api/listenContainer').then(function (response) {
        vm.decoded += response.data
        console.log(response.data)
      })
    },
    runScriptR(){
      var vm = this;
      console.log(vm.cmd)
      vm.socket.emit('runScript-idep', {cmd: vm.cmd, cnn: vm.cnn, id: vm.crntContainerID});
    },
    getDockerContainer(){
      var vm = this;
      if(vm.msg_docker !== {})
        vm.socket.emit('getDocker', 'Hello World from client');
    },
    logInformation(){
      var vm = this;
      const socket = io(vm.host);
    },
    runScript(id){
      var vm = this;
      axios.get('/api/runScript/'+id).then(function (response) {
        vm.decoded += response.data.stdout
        console.log(response.data)
      })
    },
    // Unknown
    attach(id){
      console.log(id)
      axios.get('/api/attach/'+id).then(function (response) {
        console.log(response.data)
      })
    },
    // Unknown
    resultBack(id){
      var vm = this
      axios.get('/api/return/'+id).then(function (response) {
        var enc = new TextDecoder();
        var arr = new Uint8Array(response.data.msg.data)
        var decoded = enc.decode(arr)
        vm.decoded += decoded
        console.log(decoded)
      })
    },
    async listContainers(){
      console.log("Start List")
      var vm = this 
      await axios.get('/api/listContainers').then(function (response) {
        vm.containers = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    createDocker: function(){
      console.log("Create Docker")
      axios.get('/api/createContainer2').then(function (response) {
        console.log(response.data);
      })
    },
    removeAllContainers: function(){
      var vm = this;
      axios.get('/api/removeAllContainers').then(function(response){
        console.log(response.data);
        axios.get('/api/listContainers').then(function (response) {
          vm.containers = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      })
    }
  }
}
</script>

<style scoped>
.main{
  /* padding:8px; */
}
.title
{
  margin: 30px 0;
  text-align: center;
  font-weight: 400;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>
