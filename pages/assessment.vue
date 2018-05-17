<template>
  <section>
    <!-- <header-menu></header-menu> -->
    <div class="content--container">
      <div class="sidebar--container pb2 ph4 bg-black-80 white pt4 flex justify-between flex-column">
        <div class="sidebar--content">
          <a class="code link f2 white" href="./" id="logo">Assessment _
            <!-- <span class="f5">ABOUT</span> -->
          </a>
          <p class="pv4 f6 ttu tracked karla font-smoothing">
            <a href="javascript:void(0);" class="dim no-underline fw6 white font-smoothing mobile--filter--toggle">Filter</a>
            <span class="mobile--filter--toggle"> · </span>
            <!-- <a href="./about" class="ttu tracked dim no-underline fw6 white font-smoothing">Login</a> · 
                <a href="./nominate" class="ttu tracked dim no-underline fw6 white font-smoothing">SignUp</a> -->
          </p>
          <div>
            <!-- <ul>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="readProduct(1)">
                  Revenue
                </button>
              </li>
              <li>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="getProduct(year, month)">Products This Month</button>
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
            </ul> -->
          </div>
          <hr/>
          <!-- <div class="code mt3">
            <h4> Order </h4>
            <hr/>
            <ul class="code f6">
              <li>
                <a class="code w-100 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="switchContent(1)"> Best Customer </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="drawPlots(1)"> Most Frequent Customer</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> Order Time Series </a>
              </li>
            </ul>
          </div>
          <div class="code mt3">
            <h4> FAQ </h4>
            <hr/>
            <ul class="f6">
              <li>
                <a class="code w-100 f6 link dim br1 ba bw2 ph3 pv2 mb2 dib">License</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib">Data Policy</a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib"> Feeds </a>
              </li>
              <li>
                <a class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib"> Contact Us </a>
              </li>
            </ul>
          </div> -->
        </div>
        <div class="sidebar--footer pb3 pt5 code">
          <p> ge-lab.org c 2016 <br/><br/> designed by Kevin Son</p>
        </div>
      </div>
      <div class="main--container ph3">
        <!-- <main-header></main-header> -->
        <article class="ma3">
          <div class="f4 b code"> Dashboard </div>
          <hr />
          <section name="diagnosis"></section>
          <section name="newPrd"></section>
          <pre v-if="isAailableLog" id="output" class="tracked code" style="line-height: 14px; margin: 8px auto;font-size: 11px; text-align: left; padding:15px; color:white; overflow-y: auto !important; 
                font-weight: bold; width:100%; background: #353131; height:300px;">{{msg_docker_result}}</pre>
          <button @click="msg_docker_result=''"> Clean Log</button>
          <hr/>
          
          <div class="sans-serif w-100 pa4 br2-ns ba b--black-10">
            <fieldset class="cf bn ma0 pa0">
              <div class="cf">
                <legend class="pa0 b f4 f4-ns mv2 black-80"> Select Tower </legend>
                <select v-model="selected">
                <option disabled value="">Please select one</option>
                <option value="TTN_109">TTN_109</option>
                <option value="TTN_158">TTN_158</option>
                <option value="TTN_159">TTN_159</option>
                <option value="TTN_161">TTN_161</option>
                <option value="TTN_165">TTN_165</option>
                <option value="TTN_301">TTN_301</option>
                </select>
                <span class=" mh2 code">Selected: {{ selected }}</span>
              </div>
              <div class="cf">
                <div class="fl w-50">
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> width</legend>
                    <input class="pa2 f4" v-model="width"> 
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> height</legend>
                    <input class="pa2 f4" v-model="height">
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> Min Degree of Direction </legend>
                    <input class="pa2 f4" v-model="minDeg">
                </div>
                <div class="fl w-50">
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> Max Y</legend>
                    <input class="pa2 f4" v-model="maxY"> 
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> Max X</legend>
                    <input class="pa2 f4" v-model="maxX"> 
                    <legend class="pa0 f4 b f4-ns mv2 black-80"> CEX</legend>
                    <input class="pa2 f4" v-model="cex"> 
                </div>
              </div>
            </fieldset>
            <div class="cf">
              <button class="mv2 f4 f5-l button-reset fl pv3 tc bn bg-animate 
                bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns" 
                @click="getProduct(width, height, maxY)"
                value="Generate"> Generate </button>
              <button class="mv2 f4 f5-l button-reset fl pv3 tc bn bg-animate 
                bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns" 
                @click="getDen(width, height, maxY)"
                value="Generate"> Generate All Tower </button>
            </div>
          </div>
          
          <div class="left--expand w-100 center">
            <div v-if="plots109"> TTN_109</div>
            <div class="ma1" v-for="(i, idx) in plots109" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>


          <div class="left--expand w-100 center">
            <div v-if="plots158"> TTN_158</div>
            <div class="ma1" v-for="(i, idx) in plots158" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>

          
          <div class="left--expand w-100 center">
            <div v-if="plots159"> TTN_159</div>
            <div class="ma1" v-for="(i, idx) in plots159" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>

          <div class="left--expand w-100 center">
            <div v-if="plots161"> TTN_161</div>
            <div class="ma1" v-for="(i, idx) in plots161" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>

          <div class="left--expand w-100 center">
            <div v-if="plots165"> TTN_165</div>
            <div class="ma1" v-for="(i, idx) in plots165" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>

          <div class="left--expand w-100 center">
            <div v-if="plots301"> TTN_301</div>
            <div class="ma1" v-for="(i, idx) in plots301" :key="idx">
              <img v-if="i.type=='density'" style="order: 1; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
              <img v-if="i.type=='scatter'" style="order: 2; max-width: 1200px" class="center mw-80" alt="night sky over water" :src='i.plotSrc' />
            </div>
          </div>
          
          <hr />
        </article>
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
  layout: 'rVis',
  components: {
    'header-menu': HeaderMenu,
    'report': Report,
    'main-header': Header
  },
  async asyncData() {
    let dockerData = await axios.get('api/listContainers')
    return { containers: dockerData.data }
  },
  data() {
    return {
      plots109:[],
      plots158:[],
      plots159:[],
      plots161:[],
      plots165:[],
      plots301:[],
      mos:null,
      minDeg: 0, 
      selected: 'TTN_109',
      width: 500,
      maxX: 30,
      cex: 1,
      height: 500,
      maxY: 30,
      orgs: [],
      year: 2018,
      prdId: 10000,
      month: 2,
      isAailableLog: true,
      products: [],
      imagePre: [],
      imageFinal: [],
      imageHeat: [],
      imagePca: [],
      decoded: '',
      socket: {},
      containers: [],
      msg_docker_result: '',
      //host: 'http://bioinformatics.sdstate.edu:8000',
      host: 'localhost:3001',
    }
  },
  mounted() {
    var vm = this;
    console.log(fb)
    // var orgRef = fb.ref("idep/users/kruny1001/test")
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
    //   vm.msg_docker_result += data.msg.replace(/^\s+|\s+$/g, '').replace("        ", '') + "\n";
      vm.msg_docker_result += data.msg.replace(/^\s+|\s+$/g, '') + "\n";
      var pre = document.querySelector('#output')
      setTimeout(function() { pre.scrollTo(0, document.querySelector('#output').scrollHeight) }, 1000)
    })
    vm.socket.on("prdCSV", function(image, buffer) {
    //   vm.products.push(image.buffer)
      vm.mos.push(image.buffer)
    });
    vm.socket.on("imagePre", function(image, buffer) {
      if (image) {
        if(image.id == "TTN_109")
          vm.plots109.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
        if(image.id == "TTN_158")
          vm.plots158.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
        if(image.id == "TTN_159")
          vm.plots159.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
        if(image.id == "TTN_161")
          vm.plots161.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
        if(image.id == "TTN_165")
          vm.plots165.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
        if(image.id == "TTN_301")
          vm.plots301.push({
            id:image.id,
            plotSrc: 'data:image/png;base64,' + image.buffer,
            type: image.type
          })
          
        
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
      vm.imageFinal = []
      vm.imageHeat = []
      vm.imagePca = []
    },
    getProduct(width, height) {
      var vm = this;
      vm.socket.emit('scatterplot-assessment', { id: vm.selected, 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: vm.selected, 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
    },
    getDen(width, height) {
      var vm = this;
      vm.socket.emit('denplot-assessment', { id: 'TTN_158', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: 'TTN_109', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: 'TTN_159', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: 'TTN_161', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: 'TTN_165', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('denplot-assessment', { id: 'TTN_301', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_158', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_109', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_159', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_161', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_165', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
      vm.socket.emit('scatterplot-assessment', { id: 'TTN_301', 
        cex:vm.cex,
        width: width, height: height, maxY:vm.maxY, 
        maxX:vm.maxX, minDeg: vm.minDeg });
    },
    getPrdId(id){
      console.log(id)
      var vm = this;
      vm.socket.emit('prdId-thw', {ids:id});
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
    readProduct() {
      console.log('readProduct init')
      var vm = this;
      vm.socket.emit('loadData-the', 'Hello World from client');
    },
    loadData(id) {
      console.log('loadData init')
      var vm = this;
      vm.socket.emit('loadData-idep', 'Hello World from client');
    },
    drawPlots() {
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
.left--expand {
  display: -webkit-box;
  overflow-x: scroll;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .5);
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}
</style>