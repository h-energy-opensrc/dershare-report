<template>
  <section class="ma3">
    <div class="code ma3 ba pa3" v-for="(prd, prdId) in prds" :key="prdId">
      <div>Title: {{prd.title}}</div>
      <div>Note: {{prd.note}}</div>
      <div>Price: {{prd.price}}</div> 
      <div>UPC images</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in prd.upcImgs" :key="idx">
          <img style="max-width: 400px; max-height: 85px" class="center mw-80" :src='i' />
        </div>
      </section>
      <div>Product images</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in prd.prdImgs" :key="idx">
          <img style="max-width: 400px; max-height: 85px" class="center mw-80" :src='i' />
        </div>
      </section>
      <div>Color images</div>
      <section class="left--expand">
        <div class="ma1" style="display: grid" v-for="(i, idx) in prd.colorImgs" :key="idx">
          <img style="max-width: 400px; max-height: 85px" class="center mw-80" :src='i' />
        </div>
      </section>
      <router-link :to="{ path: 'prd/'+prd.id, params: { id: prd.id }}">{{prd.id}} Detail </router-link>
    </div>
  </section>
</template>
<script>
import {database, storage} from '~/plugins/fbConn'
export default {
  data() {
    return {
      prds: []
    }
  },
  methods:{
    readFB(){
    }
  },

  mounted() {
    var vm = this;
      var bblColors = database.ref('bbl/temp/prd')
      bblColors.on('value', (snap) => {
        var target = snap.val()
        snap.forEach(item => {
          var product = item.val()
          product.id = item.key;
          vm.prds.push(product )
        })
    })
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