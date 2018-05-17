<template>
  <section >
    <div class="content--container">
      <div class="sidebar--container ph4 bg-black-80 white pt4 flex justify-between flex-column">
        <div class="sidebar--content">
          <a class="code link f2 white" href="./" id="logo">DERShare _<span class="f5">SUMMARY</span></a>
          <p class="pv4 f6 ttu tracked karla font-smoothing">
            <a href="javascript:void(0);" class="dim no-underline fw6 white font-smoothing mobile--filter--toggle">Filter</a>
            <span class="mobile--filter--toggle"> · </span>
            <a href="./about" class="ttu tracked dim no-underline fw6 white font-smoothing">Login</a> · 
            <a href="./nominate" class="ttu tracked dim no-underline fw6 white font-smoothing">SignUp</a>
          </p>
          <div>
            <ul>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="loadData(1)">LoadData & Summary</button>
              </li>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="drawPlots(1)">Pre-Process</button>
              </li>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> Remove Images </button>
              </li>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="kMeans()"> kMeans </button>
              </li>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="pca()"> PCA </button>
              </li>
            </ul>            
          </div>
          <hr/>
          <section class="code f6">
            <div> 1. Choose data type </div>

            <div> 2. Upload expression data </div>

            <div> 3. Verify guessed species. Chnage if necessary </div>

          </section>
        </div>
        <div class="sidebar--footer pb3 pt5">

        </div>
      </div>
      <div class="main--container ph3" >
        <button class="f6 link dim ph3 pv2 mb2 dib white bg-mid-gray" v-if="!isAailableLog" style="position: absolute; bottom: 20px; right: 20px" @click="isAailableLog = !isAailableLog"> Enable Log</button>
        <button  class="f6 link dim ph3 pv2 mb2 dib white bg-mid-gray" v-if="isAailableLog" style="position: absolute; bottom: 20px; right: 20px" @click="isAailableLog = !isAailableLog"> Disable Log</button>
        <div class="flex flex-wrap flex-auto center desktop--profile--container">
          <div class="mb2 w-100 wm-100 justify-center items-center center ph1 mt2">
            <div class="intro--content w-100 bb bw1 b--black-80">
              <h2 style="max-width:240px;" class="code intro--headline karla fw8 measure-narrow lh-title pb1">
                DERShare: Distributed Energy Resources Share
              </h2>
              <p class="code" style="max-width:600px;"><small>Brand new technologies and methodology of managing your DER including ESS, PV. 
                We manage your DER(Distributed Energy Resources), leverage their values, maximize your returns </small></p>
              <a href="./about" class="intro--button pv3 ph4 mv3 ba bw1 b--black-80 black-80 font-smoothing-hover hover-bg-black-80 hover-white 
                fw6 dib karla f6 ttu tracked no-underline">Read more <span class="pl2">→</span></a>
            </div>
          </div>
                  
          <pre v-if="isAailableLog" id="output" class="tracked code" 
            style="    line-height: 14px; margin: 8px auto;font-size: 11px; text-align: left; padding:15px; color:white; overflow-y: auto !important; 
              font-weight: bold; width:100%; background: #353131; height:800px;">{{msg_docker_result}}</pre>
          <hr/>
          <h3 class="underline  intro--headline karla fw6 measure-narrow lh-title pb3"> Load Data </h3>
          <div class="w-100">
            
          </div>

          <h3 class="underline intro--headline karla fw6 measure-narrow lh-title pb3"> Pre Process </h3>
          <div class="left--expand w-100 center">
            <div class="ma1" v-for="i in imagePre" >
              <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i' />
            </div>
          </div>
          
          <h3 class="underline  intro--headline karla fw6 measure-narrow lh-title pb3"> Heatmap </h3>
          <div class="left--expand w-100 center">
            <div class="ma1" v-for="i in imageHeat" >
              <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i'>
            </div>
          </div>
          
          <h3 class="underline  intro--headline karla fw6 measure-narrow lh-title pb3"> k-Means </h3>
          <div class="left--expand w-100 center">
          </div>
          
          <h3 class="underline  intro--headline karla fw6 measure-narrow lh-title pb3"> PCA </h3>
          <div class="left--expand w-100 center">
            <div class="ma1"  v-for="i in imagePca" >
              <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i'>
            </div>
          </div>
        </div>
        <report></report>
      </div>
    </div>
  </section>
</template>

<script>
  import HeaderMenu from '~/components/Header.vue'
  import Report from '~/components/Report.vue'

  import axios from '~/plugins/axios'
  import io from 'socket.io-client';
  import firebase from 'firebase'

  import Header from '~/components/Header'

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
    fb = firebase.database()
  }

  export default {
    components: {
      'header-menu' : HeaderMenu,
      'report' : Report,
      'main-header': Header
    },
    async asyncData() {
      let dockerData = await axios.get('api/listContainers')
      return { containers: dockerData.data }
    },
    data() {
      return {
        orgs: [],
        isAailableLog: true,
        imagePre: [],
        imageFinal: [],
        imageHeat: [],
        imagePca: [],
        decoded: '',
        socket: {},
        containers: [],
        msg_docker_result: '',
        //host: 'http://bioinformatics.sdstate.edu:8000',
        host: '0.0.0.0:3001',
      }
    },
    mounted() {
      var vm = this;
      // console.log(fb)
      // // var orgRef = fb.ref("idep/users/kruny1001/test")
      // var orgRef = fb.ref("idep/users/kruny1001")
      // orgRef.once('value', function(snap) {
      //   vm.orgs = snap.val()
      // })
      vm.socket = io.connect(vm.host)
      vm.socket.on('connect', function(data) {
        vm.socket.emit('join', 'Hello World from client');
      })
      vm.socket.on('messages', function(data) {
        vm.msg = data;
      });
      vm.socket.on('docker_result_msg', function(data) {
        vm.cnn = data.cnn
        vm.msg_docker_result += data.msg.replace(/^\s+|\s+$/g, '').replace("        ", '') + "\n";
        var pre = document.querySelector('#output')
        setTimeout(function() { pre.scrollTo(0, document.querySelector('#output').scrollHeight) }, 1000)
      })
      vm.socket.on("imagePre", function(image, buffer) {
        if (image) {
          vm.imagePre.push('data:image/png;base64,' + image.buffer);
        }
      });
      vm.socket.on("imageFinal", function(image, buffer) {
        if (image) {
          vm.imageFinal.push('data:image/png;base64,' + image.buffer);
        }
      });
      vm.socket.on("imageHeat", function(image, buffer) {
        if (image) {
          vm.imageHeat.push('data:image/png;base64,' + image.buffer);
        }
      });
      vm.socket.on("imagePca", function(image, buffer) {
        if (image) {
          vm.imagePca.push('data:image/png;base64,' + image.buffer);
        }
      });
      vm.listContainers()
    },
    methods: {
      buildModel() {
        var vm = this;
        vm.socket.emit('buildModel', 'Hello World from client');
      },
      removeImgs() {
        var vm = this;
        vm.imagePre = []
        vm.imageFinal= []
        vm.imageHeat =[]
        vm.imagePca =[]
      },
      runScript(id) {
        console.log('r')
        var vm = this;
        vm.socket.emit('getDocker-compute', 'Hello World from client');
        // axios.get('/api/unsupervised').then(function (response) {
        //     vm.decoded += response.data.msg
        //     console.log(response.data)
        // })
      },
      loadData(id) {
        console.log('ts-summary')
        var vm = this;
        vm.socket.emit('ts-summary', 1);
        // axios.get('/api/unsupervised').then(function (response) {
        //     vm.decoded += response.data.msg
        //     console.log(response.data)
        // })
      },
      drawPlots(){
        console.log('loadData init')
        var vm = this;
        vm.socket.emit('loadData-idep-plots', 'Hello World from client');
      },
      async listContainers() {
        console.log("Start List")
        var vm = this
        await axios.get('/api/listContainers').then(function(response) {
          vm.containers = response.data;
        })
          .catch(function(error) {
            console.log(error);
          });
      },

    }
  }
</script>
<style>
.left--expand{
  display: -webkit-box;
  overflow-x: scroll;
}
</style>