<template>
  <section class="ma3">
    <header-nav></header-nav>
    <h1> 사이트 새로 넣기 </h1>
    <small> 샤이트 정보 입력 폼</small>
    <form> 
      <fieldset>     
        <div>
          <small> 고객 정보 </small>
          <label>고객 이름</label>
          <input v-model="citeInfo.bizName" />
        </div> 
        <hr>
        <small> iSmart 정보 </small>
        <div>
          <label>고객 번호</label>
          <input v-model="citeInfo.account" />
          <label>패스워드</label>
          <input v-model="citeInfo.pw" />
        </div>
        <hr>
        <div> 
          <label>적용전력</label>
          <input v-model="citeInfo.applied" />
          <label>계약전력</label>
          <input v-model="citeInfo.actual" />
          <label>계약종별</label>
          <input v-model="citeInfo.type" />
        </div>
        <hr>
        <div> 
          <label>검칠일</label>
          <input v-model="citeInfo.meterDay" />
          <label>주소</label>
          <input v-model="citeInfo.addr" />
          <div>
            <small> 좌표</small>
            <label>로케이션</label>
            <input v-model="citeInfo.loc.log" />
            <label>로케이션</label>
            <input v-model="citeInfo.loc.lat" />
          </div>
          <label>용도</label>
          <input v-model="citeInfo.officeType" />
        </div>
      </fieldset>
      <fieldset>
        <label>RefName</label>
        <input v-model="citeInfo.refName" />
        <label>Status</label>
        <input v-model="citeInfo.status" />
      </fieldset>
    </form>
    
    <button @click="addNewCite(citeInfo)">새로 만들기 </button>
  </section>
</template>
<script> 
import { mapGetters, mapActions } from 'vuex'
import Header from '~/components/HeaderPostech'

export default {
    name: "addCite",
    components: {
      headerNav: Header
    },
    methods: {
      ...mapActions({
        addNewCite : 'datasetModule/addNewCite', // map `this.increment()` to `this.$store.dispatch('increment')`
      }),
    },
    computed: {
     ...mapGetters(
      {
        datasets: 'datasetModule/getAllDatasets',
        citeInfo: 'datasetModule/getCrntNewSite'
      }
    )
  },
    data(){
      return{
      }
    }

}
</script>
<style></style>