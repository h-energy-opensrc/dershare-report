<template>
  <section class="pa2">
    <nuxt-link class="error-link" to="/list">Back to temp product list</nuxt-link>
    <div class="f3 b mb2"> Product: {{product.id}}</div>
    <div class="f3 b mb2"> Product: {{product.title}}</div>
    <section class="dt dt--fixed w-100">
      <ul class="dtc">
        <li><h3 class="f3 b mb2">Product Images</h3></li>
        <li><img v-for="(prdImg, idx) in product.prdImgs" :src="prdImg" :key="idx"></li>
      </ul>
      <ul class="dtc">
        <li><h3 class="f3 b mb2">Option Images</h3></li>
        <li><img v-for="(prdImg, idx) in product.colorImgs" :src="prdImg" :key="idx"></li>
      </ul>
      <ul class="dtc">
        <li><h3 class="f3 b mb2">UPC Images</h3></li>
        <li><img v-for="(prdImg, idx) in product.upcImgs" :src="prdImg" :key="idx"></li>
      </ul>
    </section>
    <section>
      <h3 class="f3 b mv2">Product Note</h3>
      <div>{{product.note}}</div>
      <h3 class="f3 b mv2">Price</h3>
      <div class="f4">{{product.price}}</div>
    </section>
    <section>
      <button class="ma3"> Create New Product </button>
      <button class="ma3"> Published </button>
    </section>
  </section>
</template>

<script>
// import axios from '~/plugins/axios'
import {database, storage} from '~/plugins/fbConn'
import _ from 'lodash'

export default {
  name: 'prdInfo',
  asyncData ({ params, error }) {
    
    // return axios.get('/api/users/' + params.id)
    //   .then((res) => {
    //     return { user: res.data }
    //   })
    //   .catch((e) => {
    //     error({ statusCode: 404, message: 'User not found' })
    //   })
  },
  data(){
    return {
      id: "",
      prds: [],
      product: {id:""}
    }
  },
  head () {
    return {
      title: `Prds: ${this.product.id}`
    }
  },
  mounted(){
    var vm = this;
    console.log(vm.$route)
    vm.product.id = vm.$route.params.id
    var bblColors = database.ref('bbl/temp/prd/'+vm.product.id)
      bblColors.on('value', (snap) => {
        var target = snap.val()
        console.log(target)
        if (target) {
          vm.product = _.assign({}, vm.product, target);
        }
    })

  }
}
</script>

<style scoped>
.title
{
  margin-top: 30px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 30px;
}
</style>
