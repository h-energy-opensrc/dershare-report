<template>
  <section>
    <header-nav></header-nav>
    <section class="pa3 pa4-ns">
      <div> Data with NA value</div>
      <div style="    display: grid;">
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc1.csv?alt=media&token=ed475d8d-9513-4667-8fc8-dcebf0033491" download> C1 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc2.csv?alt=media&token=d341068d-49b2-4205-9a82-2e5c9a9e7084" download> C2 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc4.csv?alt=media&token=6990b259-e4da-45eb-bc5b-9729994aa410" download> C4 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc5.csv?alt=media&token=c2c66066-e34c-404f-bea1-c4870624267f" download> C5 </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc6.csv?alt=media&token=2b7654e7-7505-4b39-9c3a-de79c00b344c" download> C6 </a>
      </div>

      <div> Data without NA value</div>
      <div style="    display: grid;">
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc1.na.csv?alt=media&token=8be7ae0d-f7c4-4a34-94b1-5f3d3df6448e" download> C1.NA </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc2.na.csv?alt=media&token=a429a72e-6bfc-471e-b3cb-da583e785295" download> C2.NA </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc4.na.csv?alt=media&token=4ade7fc2-304e-4d78-aefd-dca8c6981ab5" download> C4.NA </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc5.na.csv?alt=media&token=1b15de60-9514-4f39-9c12-de13fa3a813a" download> C5.NA </a>
        <a href="https://firebasestorage.googleapis.com/v0/b/postechproject.appspot.com/o/iSmart%2Fc6.na.csv?alt=media&token=d0442c2e-ea98-4f22-b9a4-b451987a9a33" download> C6.NA </a>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '~/components/HeaderPostech'

export default {
  name: 'Main',
  components: {
    headerNav: Header
  },
  computed: {
     ...mapGetters(
      {
        datasets: 'datasetModule/getAllDatasets'
      }
    )
  },
  data() {
    return {
      online: true
    }
  },
  mounted() {
    if (!window.navigator) {
      this.online = false
      return
    }
    this.online = Boolean(window.navigator.onLine)
    window.addEventListener('offline', this._toggleNetworkStatus)
    window.addEventListener('online', this._toggleNetworkStatus)
  },
  methods: {
    _toggleNetworkStatus({ type }) {
      this.online = type === 'online'
    }
  },
  destroyed() {
    window.removeEventListener('offline', this._toggleNetworkStatus)
    window.removeEventListener('online', this._toggleNetworkStatus)
  }
}
</script>

<style>

</style>
