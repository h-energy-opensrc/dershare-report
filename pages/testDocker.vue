
<template>
  <section class="pa3">
    <div>
        <h3> Digit Recognition </h3>
        <!-- 
        <button @click="runScript(1)">create containers</button>
        -->
        <button @click="testAsync(1)">Start Job</button>
        <button @click="buildModel()"> Build Model </button>
        
        <pre>
            This is a proof of concept of computing conatainers. 
            Job 1: Read unlabled digit pixel images and Do Unsupervised Learning
            Job 2: Draw T-SNE 
            Job 3: test PCA10
            Job 4: test PCA25
            Job 5: test PCA35
        </pre>

        <pre id="output" class="tracked code" style="margin: 47px auto; text-align: left; padding:15px; color:white; overflow-y: auto !important; font-size:11px; font-weight: bold; width:100%; background: #353131; height:300px;">{{msg_docker_result}}</pre>

        <h3> Unsupervised Learning </h3>
        <img class="mw10" v-for="i in img" :src='i'>
        <!--
        <pre>{{decoded}} {{orgs}}</pre>
        -->
        <div class="cnt in containers" v-for="cnt in containers">{{cnt.Id}}</div>
    </div>
    <div>
        <h3> Supervised Learning </h3>
        <img class="mw10" v-for="i in imageFinal" :src='i'>
    </div>
    <div>
        <h3> Model Testing </h3>
        
    </div>
    
  </section>
</template>

<script>
import axios from '~/plugins/axios'

import io from 'socket.io-client';

import firebase from 'firebase'
var fb
let config = {
    apiKey: "AIzaSyBO4CCJzL7U9pFSEv-9ETqVt5dzMNKiwk4",
    authDomain: "bcloud.firebaseapp.com",
    databaseURL: "https://bcloud.firebaseio.com",
    projectId: "firebase-bcloud",
    storageBucket: "firebase-bcloud.appspot.com",
    messagingSenderId: "172712893865"
};
if (firebase.apps.length === 0) {
    firebase.initializeApp(config)
    fb = firebase.database()}
export default {
    async asyncData () {
        let dockerData = await axios.get('api/listContainers')
        return { containers: dockerData.data}
    },
    data() {
      return{
        orgs: [],
        img:[],
        imageFinal:[],
        decoded: '',
        socket:{},
        containers: [],
        msg_docker_result:'',
        //host: 'http://bioinformatics.sdstate.edu:8000',
        host: 'localhost:3001',
      }
    },
    mounted() {
        var vm = this;
        console.log(fb)
        // var orgRef = fb.ref("idep/users/kruny1001/test")
        var orgRef = fb.ref("idep/users/kruny1001")
        orgRef.once('value', function(snap){
            vm.orgs = snap.val()
        })

        vm.socket = io.connect(vm.host)
        vm.socket.on('connect', function(data){
            vm.socket.emit('join', 'Hello World from client');
        })
        vm.socket.on('messages', function(data) {
        vm.msg = data;
        });
        vm.socket.on('docker_result_msg', function(data){
        vm.cnn = data.cnn
        vm.msg_docker_result += data.msg.replace(/^\s+|\s+$/g,'').replace("        ",'') + "\n";
        var pre = document.querySelector('#output')
        setTimeout(function(){ pre.scrollTo(0, document.querySelector('#output').scrollHeight) }, 1000)})
        vm.socket.on("image", function(image, buffer) {
            if(image) {
                vm.img.push('data:image/png;base64,' + image.buffer);
            }
        });
        vm.socket.on("imageFinal", function(image, buffer) {
            if(image) {
                vm.imageFinal.push('data:image/png;base64,' + image.buffer);
            }
        });
        vm.listContainers()
    },
    methods: {
        buildModel(){
            var vm = this;
            vm.socket.emit('buildModel', 'Hello World from client');
        },
        removeImgs(){
            var vm = this;
            vm.img = [];
        },
        runScript(id){
            var vm = this;
            vm.socket.emit('getDocker-compute', 'Hello World from client');
            // axios.get('/api/unsupervised').then(function (response) {
            //     vm.decoded += response.data.msg
            //     console.log(response.data)
            // })
        },
        testAsync(id){
            var vm = this;
            vm.socket.emit('asyncRun', 'Hello World from client');
            // axios.get('/api/unsupervised').then(function (response) {
            //     vm.decoded += response.data.msg
            //     console.log(response.data)
            // })
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

    }
}
</script>