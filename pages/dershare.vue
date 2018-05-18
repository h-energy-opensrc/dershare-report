<template>
  <section >
    <!-- Left menu nav -->
    <div class="content--container">
        <div class="sidebar--container ph4 bg-black-80 white pt4 flex justify-between flex-column">
            <div class="sidebar--content">
                <a class="code link f2 white" href="./dershare" id="logo">DERShare 
                <!-- _<span class="f5">Report Tool</span> -->
                </a>
                <p class="pv4 f6 ttu tracked karla font-smoothing">
                  <a href="javascript:void(0);" class="dim no-underline fw6 white font-smoothing mobile--filter--toggle">Filter</a>
                  <span class="mobile--filter--toggle"> · </span>
                  <a href="./dershare" class="code ttu tracked dim no-underline fw6 white font-smoothing">Login</a> · 
                  <a href="./dershare" class="code ttu tracked dim no-underline fw6 white font-smoothing">SignUp</a>
                </p>
                <div>
                  <ul>
                    <li>
                        <!-- <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="loadData(1)"> Data Exploratory Analysis </button> -->
                        <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="dataExplore()"> Data Exploratory Analysis </button>
                    </li>
                    <li>
                        <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="bizAnalysisDershare()">Business Analysis</button>
                    </li>
                    <li>
                        <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="removeImgs()"> Clear Report </button>
                    </li>
                  </ul>            
                </div>
                <hr/>
                <section class="code f6">
                    <div> 1. 비지니스 어카운트 선택 </div>
                    <div> 2. 데이터 전처리 </div>
                    <div> 3. 사업성 분석 </div>
                </section>
            </div>
        <div class="sidebar--footer pb3 pt5"></div>
      </div>
      
      <!-- Main Content -->
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
              <!-- <a href="./about" class="intro--button pv3 ph4 mv3 ba bw1 b--black-80 black-80 font-smoothing-hover hover-bg-black-80 hover-white 
                fw6 dib karla f6 ttu tracked no-underline">Read more <span class="pl2">→</span></a> -->
            </div>
          </div>
          
          <!-- Log -->
          <pre v-if="isAailableLog" id="output" class="tracked code" 
            style="line-height: 14px; margin: 8px auto;font-size: 11px; text-align: left; padding:15px; color:white; overflow-y: auto !important; 
              font-weight: bold; width:100%; background: #353131; height:300px;">{{msg_docker_result}}</pre>

          <section class="ma2 pa4 w-100">
            <h3 class="code f4"> 사업평가서 측정값 </h3>
            <div class="code pa1 fl w-30 bg-near-white">
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 어카운트 </label>
                <input v-model="input_feasible.measure_csv" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2  measure">
                <label for="name" class="f6 b db mb2"> 운영 시작월 </label>
                <input v-model="input_feasible.start_month" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
              </div>
              <div class="mv2  measure">
                <label for="name" class="f6 b db mb2"> 계약전력(kW) </label>
                <input v-model="input_feasible.contract_demand" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2  measure">
                <label for="name" class="f6 b db mb2"> 운영 기간(년) </label>
                <input v-model="input_feasible.simulation.life_cycle" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 배터리 단가(원/kWh) </label>
                <input v-model="input_feasible.simulation.construction.battery" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
            </div>
            <div class="code pa1  fl w-30 bg-light-gray">
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 단가 (원/kW) </label>
                <input v-model="input_feasible.simulation.construction.pcs" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 시공 단가 (원/kWh) </label>
                <input v-model="input_feasible.simulation.construction.install" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>

              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> EMS 닽가 (원/kWh)</label>
                <input v-model="input_feasible.simulation.construction.ems" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 관리비(%) </label>
                <input v-model="input_feasible.simulation.construction.manage" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>

              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 집중회수기간(년) </label>
                <input v-model="input_feasible.simulation.ess_share.intense_period" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
            </div>
            <div class="code pa1  fl w-30 bg-near-white">
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 집중회사기간 내 수용가 지급율(%) </label>
                <input v-model="input_feasible.simulation.ess_share.intense_rate" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 수용가 지급율(%) </label>
                <input v-model="input_feasible.simulation.ess_share.normal_rate" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>

              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 관리비율(%) </label>
                <input v-model="input_feasible.simulation.operation.sga_rate" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 법인세율(%) </label>
                <input v-model="input_feasible.simulation.operation.corp_tex_rate" id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc">
                
              </div>
              <div class="mv2 measure ">
                <label for="name" class="f6 b db mb2"> 사업성 평가하기 </label>
                <button class="w-100 f5 link dim br1 ba bw2 ph3 pv2 mb2 dib" @click="bizAnalysisDershare(1)">Business Analysis</button>
              </div>
            </div>
            <!-- {{input_feasible}} -->
          </section>

          <!-- <section class="code ma2 pa4 w-100" v-if="feasibleResult !== {}">
            <h3 class="f4"> 사업성 평가결과 요약</h3>
              <div v-for="(result, idx) in feasibleResult.buffer" :key="idx">
                <div>{{result.id}}</div>
                <div>{{result.battery}}</div>
                <div>{{result.pcs}}</div>
                <div>{{result.construction_cost}}</div>
                <div>{{result.equity}}</div>
                <div>{{result.peak_cut}}</div>
                <div>{{result.equity_irr}}</div>
                <div>{{result.project_irr}}</div>
                <div>{{result.project_irr}}</div>
                <section id="net_cach_flow">
                  
                </section>
                <section id="cumul_cach_flow">
                  
                </section>
                <section>
                  <h3>spring_fall_peak</h3> 
                  <div>
                    {{result.spring_fall_peak.after_peak}}
                    {{result.spring_fall_peak.before_peak}}
                    {{result.spring_fall_peak.date}}
                  </div>
                  <div>
                  </div>
                </section>
                <section>
                  <h3>summer_peak</h3> 
                  <div>
                    {{result.summer_peak.after_peak}}
                    {{result.summer_peak.before_peak}}
                    {{result.summer_peak.date}}
                  </div>
                  <div>
                  </div>
                </section>
                

                <section>
                  <h3>winter_peak</h3> 
                  <div>
                    {{result.winter_peak.after_peak}}
                    {{result.winter_peak.before_peak}}
                    {{result.winter_peak.date}}
                  </div>
                  <div>

                  </div>
                </section>
              </div>
          </section> -->
      
          <hr/>
          
          <section class="w-100">
            <h3 class="code underline intro--headline karla fw6 measure-narrow lh-title pb3"> Max, Min, Sum by Week of Days </h3>
            <div class="left--expand w-100 center">
              <div class="ma1" v-for="i in imagePre" >
                <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i' />
              </div>
            </div>

            <h3 class="code underline  intro--headline karla fw6 measure-narrow lh-title pb3"> Yearly </h3>
            <div class="left--expand w-100 center">
              <div class="ma1" v-for="i in imageHeat" >
                <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i'>
              </div>
            </div>

            <h3 class="code underline intro--headline 
              karla fw6 measure-narrow lh-title pb3"> 사업성 평가 </h3>
            <div class="w-100 center">
              <div class="ma1" v-for="(i, idx) in imageBiz" :key="idx" >
                
                <div>
                  <table class="collapse ba br2 b--black-10 pv2 ph3">
                    <thead>
                      <tr class="striped--light-gray ">
                        <th class="pv2 ph3 tl f6 fw6 ttu">battery</th>
                        <th class="pv2 ph3 tl f6 fw6 ttu">Construction_Cost</th>
                        <th class="pv2 ph3 tl f6 fw6 ttu">equity_irr</th>
                        <th class="pv2 ph3 tl f6 fw6 ttu">pcs</th>
                        <th class="pv2 ph3 tl f6 fw6 ttu">peak_cut</th>
                        <th class="pv2 ph3 tl f6 fw6 ttu">project_irr</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="striped--light-gray ">
                        <td class="pv2 ph3">{{feasibleResult[idx].battery}}</td>
                        <td class="pv2 ph3">{{feasibleResult[idx].construction_cost}}</td>
                        <td class="pv2 ph3">{{feasibleResult[idx].equity_irr}}</td>
                        <td class="pv2 ph3">{{feasibleResult[idx].pcs}}</td>
                        <td class="pv2 ph3">{{feasibleResult[idx].peak_cut}}</td>
                        <td class="pv2 ph3">{{feasibleResult[idx].project_irr}}</td>
                      </tr>
                    </tbody>
                  </table>  
                </div>
                <img style="" class="center mw-80" alt="night sky over water" :src='i' />
              </div>
            </div>
            
            <!-- <h3 class="code underline  intro--headline karla fw6 measure-narrow lh-title pb3"> k-Means </h3>
            <div class="left--expand w-100 center">
            </div>
            
            <h3 class="code underline  intro--headline karla fw6 measure-narrow lh-title pb3"> PCA </h3>
            <div class="left--expand w-100 center">
              <div class="ma1"  v-for="i in imagePca" >
                <img style="max-width: 400px" class="center mw-80" alt="night sky over water" :src='i'>
              </div>
            </div> -->
          </section>
          
        </div>
        <!-- <report></report> -->
      </div>
    </div>
  </section>
</template>

<script>
import HeaderMenu from "~/components/Header.vue";
import Report from "~/components/Report.vue";

import axios from "~/plugins/axios";
import io from "socket.io-client";
import firebase from "firebase";

import Header from "~/components/Header";

var fb;
let config = {
  apiKey: "AIzaSyBO4CCJzL7U9pFSEv-9ETqVt5dzMNKiwk4",
  authDomain: "bcloud.firebaseapp.com",
  databaseURL: "https://bcloud.firebaseio.com",
  projectId: "firebase-bcloud",
  storageBucket: "firebase-bcloud.appspot.com",
  messagingSenderId: "172712893865"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
  fb = firebase.database();
}

export default {
  components: {
    "header-menu": HeaderMenu,
    report: Report,
    "main-header": Header
  },
  async asyncData() {
    let dockerData = await axios.get("api/listContainers");
    return { containers: dockerData.data };
  },
  data() {
    return {
      acc: "",
      feasibleResult : {},
      input_feasible: {"measure_csv":"./ts/1316121995.na.csv","start_month": "2018-06",
          "contract_demand": 5720,
          "charge": {
              "demand": 8320,
              "energy": {
                  "summer": {
                      "light": 56.1,
                      "normal": 109.0,
                      "heavy": 191.1
                  },
                  "spring_fall": {
                      "light": 56.1,
                      "normal": 78.6,
                      "heavy": 109.3
                  },
                  "winter": {
                      "light": 63.1,
                      "normal": 109.2,
                      "heavy": 166.7
                  }
              }
          },
          "simulation": {
              "pcs": [50, 75, 100, 250, 400, 500, 750, 800, 1000, 1250, 1500, 1600, 2000, 2500],
              "battery": {
                  "min": 0.05,
                  "max": 0.2,
                  "inc": 100
              },
              "life_cycle": 14,
              "construction": {
                  "battery": 300000,
                  "pcs": 140000,
                  "install": 133000,
                  "ems": 30000,
                  "manage": 0.03
              },
              "ess_share": {
                  "intense_period": 5,
                  "intense_rate": 0.15,
                  "normal_rate": 0.55
              },
              "finance": {
                  "borrow_rate": 0.0,
                  "grace_period": 1,
                  "principal_payment_period": 6,
                  "interest_rate": 0.04
              },
              "operation": {
                  "sga_rate": 0.01,
                  "depreciation_period": 7,
                  "corp_tex_rate": 0.22
              }
          }
      },
      orgs: [],
      isAailableLog: true,
      imagePre: [],
      imageBiz: [],
      imageFinal: [],
      imageHeat: [],
      imagePca: [],
      decoded: "",
      socket: {},
      containers: [],
      msg_docker_result: "",
      //host: 'http://bioinformatics.sdstate.edu:8000',
      // host: "35.200.80.26:3001"
      host: "0.0.0.0:3001"
    };
  },
  mounted() {
    var vm = this;
    vm.socket = io.connect(vm.host);
    vm.socket.on("connect", function(data) {
      vm.socket.emit("join", "Hello World from client");
    });

    vm.socket.on("feasible", function(data) {
      console.log(data)
      vm.feasibleResult = data.buffer
      // data.HeaderMenu
      var tempResult =data.buffer
      // console.log(JSON.stringify(tempResult))
      vm.socket.emit("biz-summary", JSON.stringify(tempResult))
    });
    
    vm.socket.on("messages", function(data) {
      vm.msg = data;
    });

    vm.socket.on("docker_result_msg", function(data) {
      vm.cnn = data.cnn;
      vm.msg_docker_result +=
        data.msg.replace(/^\s+|\s+$/g, "").replace("        ", "") + "\n";
      var pre = document.querySelector("#output");
      setTimeout(function() {
        pre.scrollTo(0, document.querySelector("#output").scrollHeight);
      }, 1000);
    });
    vm.socket.on("imagePre", function(image, buffer) {
      if (image) {
        vm.imagePre.push("data:image/png;base64," + image.buffer);
      }
    });
    vm.socket.on("imageBiz", function(image, buffer) {
      if (image) {
        vm.imageBiz.push("data:image/png;base64," + image.buffer);
      }
    });
    vm.socket.on("imageHeat", function(image, buffer) {
      if (image) {
        vm.imageHeat.push("data:image/png;base64," + image.buffer);
      }
    });
    vm.socket.on("imagePca", function(image, buffer) {
      if (image) {
        vm.imagePca.push("data:image/png;base64," + image.buffer);
      }
    });
    vm.listContainers();
  },
  methods: {
    dataExplore() {
      var vm = this;
      var vm = this;
      // vm.socket.emit("dataExplore-dershare", "Hello World from client")
      vm.socket.emit("ts-summary", "Hello World from client")
      vm.socket.emit("join-test-TS", "Hello World from client")
    },
    buildModel() {
      var vm = this;
      vm.socket.emit("buildModel", "Hello World from client");
    },
    removeImgs() {
      var vm = this;
      vm.imagePre = [];
      vm.imageFinal = [];
      vm.imageHeat = [];
      vm.imagePca = [];
    },
    runScript(id) {
      console.log("r");
      var vm = this;
      vm.socket.emit("getDocker-compute", "Hello World from client");
      // axios.get('/api/unsupervised').then(function (response) {
      //     vm.decoded += response.data.msg
      //     console.log(response.data)
      // })
    },
    loadData(id) {
      console.log("loadData init");
      var vm = this;
      vm.socket.emit("loadData-idep", "Hello World from client");
      // axios.get('/api/unsupervised').then(function (response) {
      //     vm.decoded += response.data.msg
      //     console.log(response.data)
      // })
    },
    bizAnalysisDershare(){
      var vm = this;
      // var input = '{"measure_csv":"./ts/1316121995.na.csv","start_month": "2018-06","contract_demand": 5720,"charge": {"demand": 8320,"energy": {"summer": {"light": 56.1,"normal": 109.0,"heavy": 191.1},"spring_fall": {"light": 56.1,"normal": 78.6,"heavy": 109.3},"winter": {"light": 63.1,"normal": 109.2,"heavy": 166.7}}},"simulation": {"pcs": {"min": 0.05,"max": 0.1,"inc": 0.05},"battery": {"min": 0.11,"max": 0.13,"inc": 0.01},"life_cycle": 14,"construction": {"battery": 300000,"pcs": 140000,"install": 133000,"ems": 30000,"manage": 0.03},"ess_share": {"intense_period": 5,"intense_rate": 0.15,"normal_rate": 0.55},"finance": {"borrow_rate": 0.0,"grace_period": 1,"principal_payment_period": 6,"interest_rate": 0.04},"operation": {"sga_rate": 0.01,"depreciation_period": 7,"corp_tex_rate": 0.22}}}'
      var input = JSON.stringify(vm.input_feasible)
      vm.socket.emit("biz-analysis-dershare", input);
    },
    drawPlots() {
      console.log("loadData init");
      var vm = this;
      vm.socket.emit("loadData-idep-plots", "Hello World from client");
    },
    async listContainers() {
      console.log("Start List");
      var vm = this;
      await axios
        .get("/api/listContainers")
        .then(function(response) {
          vm.containers = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
.left--expand {
  display: -webkit-box;
  overflow-x: scroll;
}
</style>