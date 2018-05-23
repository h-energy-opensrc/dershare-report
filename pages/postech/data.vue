<template>
  <section>
    <header-nav></header-nav>
    <section class="pa3 pa4-ns">
      <h2> 데이터 리스트 </h2>
      <div style="    display: grid;">
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc1.csv?alt=media&token=9766a5e7-e197-442d-9767-5245b86ff093" download> C1 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc2.csv?alt=media&token=747cd368-a379-4609-8666-84d764b65dce" download> C2 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc4.csv?alt=media&token=9f1b4d60-d3e4-444b-963b-43c797adaa63" download> C4 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc5.csv?alt=media&token=ca5eded1-2166-45dd-86ec-c1e72cff4c29" download> C5 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc6.csv?alt=media&token=2b4acc05-20ed-46e0-be22-62a256b61b11" download> C6 </a>
      </div>
    </section>
  </section>
</template>
<script>
import { database, storage } from '~/plugins/fbConn'
import Header from '~/components/HeaderPostech'
import * as d3 from "d3"

export default {
  name: 'Data',
  components: {
    headerNav: Header
  },
  data(){
    return{
      datasets : []
    }
  },
  mounted() {
    console.log(d3)
    var vm = this;
    // var ref = database.ref('data/c1').limitToLast(2)
    // ref.on('value', (snap)=> {
    //   snap.forEach((individual)=> {
    //     console.log(individual.key)
    //     vm.datasets.push(individual.val())
    //   })
    // })
  }
}
</script>
<style></style>