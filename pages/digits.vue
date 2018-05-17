<template>
  <section class="main">
  <!--<img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />-->
    <h1 class="title">Digit Recognition In Parallel</h1>
    <p> Test Case of Computation Container</p>
    <pre>{{status}}</pre>
    <button @click="init()"> Start </button>
    <button @click="getImg()">GET Img</button>
    <pre class="f7 code">{{decoded.msg}}</pre>
    <img src="http://bioinformatics.sdstate.edu:8000/api/getTSNEImg2"/>
    <ul>
      <li v-for="item in imgs">
        <img src="/api/getTSNEImg">
      </li>
    </ul>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let dockerData = await axios.get('api/listContainers')
    return { containers: dockerData.data}
  },
  mounted() {},
  head () {
    return {
      title: 'Users'
    }
  },
  data() {
    return{ 
      status: "",
      imgs: [],
      crntContainerID:"", decoded: "", cnn:false, msg:"", msg_docker:{}, socket:{}, msg_docker_result:"", cmd:""}
  },
  methods: {
    init(){
      var vm = this;
      vm.status = "Initialize Server"
      axios.get('/api/createTSNE').then(function (response) {
        vm.decoded = response.data
        vm.status = "Done with createTSNE"
        return 0;
      }).then(()=>{
        vm.status = "Start getTSNEImg"
        axios.get('/api/getTSNEImg').then(function (response) {
          vm.status = "Done with getTSNEImg"
          var baseImg = `data:image/png;base64, ${response.data}`
          vm.imgs.push(baseImg) 
          return 0;
        })
      }).then(()=>{

      })
    },
    getImg(){
      var vm = this;
      axios.get('/api/getTSNEImg').then(function (response) {
        console.log(response)
          var baseImg = `data:image/png;base64, ${response.data}`
          vm.imgs.push(baseImg) 
          return 0;
        })
    },
    connR(id){
      var vm = this;
      vm.crntContainerID = id
      var cmd = "print('connected to "+ id+"')"
      vm.socket.emit('runScript', {cmd: cmd, cnn: vm.cnn, id: id});
    },
  }
}
</script>

<style scoped>
.main{
  padding:8px;
}
.title
{
  margin: 30px 0;
  text-align: left;
}
</style>