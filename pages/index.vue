<template>
  <section class="main">
    <h1 class="f2 code title">H-Energy</h1>
<!--   
    <login></login>
    <docker-list></docker-list> -->

    <div class="avenir pa5 ma2" style="max-width: 950px; margin: 0px auto">
      <p> 데이터 시각화, 분석, 파이프라인 에너지비용 시뮬레이션 Reports</p>
      <ul class="pa2">
        <li>
          <a href="./dershare" class="ma2 code ttu tracked dim no-underline fw6 font-smoothing">1. DERShare</a>
          <a href="./postech" class="ma2 code ttu tracked dim no-underline fw6 font-smoothing">2. Postech Project</a>
        </li>
      </ul>
    </div>
    
    <article class="cf avenir">
      <div style="" class="fl w-100 bg-near-white">      
        <!-- Feature List  -->
        <div 
          v-for="(cnt, idx) in cnts" :key="idx"
          class="bg-near-white pa5 ma2" 
          style="max-width: 950px; margin: 0px auto">
          <h3 class=f3> {{cnt.name}} </h3>
          <ul class="ma2">
            <li v-for="(ch, cIdx) in cnt.child" :key="cIdx"> {{ch.name}}: {{ch.desc}}</li>
          </ul>
        </div>
      </div>
    </article>

    

  </section>
</template>

<script>
import axios from "~/plugins/axios";
import Header from "~/components/Header";
import Login from "~/components/Login";
import DockerList from "~/components/DockerList";

export default {
  components: {
    "main-header": Header,
    "login":Login,
    "docker-list": DockerList
  },
  async asyncData() {
    // let dockerData = await axios.get('api/listContainers')
    // return { containers: dockerData.data}
  },
  mounted() {},
  head() {
    return {
      title: "H-Energy: Home"
    };
  },
  data() {
    return {
      cnts: [{
        name: "시스템",
        child:[
          {name: "전기요금표관리", desc:"한전전기 요금표 관리"},
          {name: "공휴일관리", desc:"대한민국 공휴일 관리. 설 추석 음력환산. 선거일 대체 공휴일 임시공휴일 관리"},
          {name: "암호화", desc:"고객 iSmart 비밀전호등 비밀정보에 대한 db 암호화"},
          {name: "기상정보 위치 추출", desc:"주소에대한 동네일기예보 좌표 추출"},
          {name: "전력요금계산", desc:"전력 수요 데이터를 이용한 전력 요금 계산"}
        ]
      }]
    };
  },
  methods: {
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

<style scoped>
.main {
  /* padding:8px; */
}
.title {
  margin: 30px 0;
  text-align: center;
  font-weight: 400;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}
</style>
