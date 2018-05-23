<template>
  <section>
    <header-nav></header-nav>
    <section class="ma3">
      <h2> 사이트 수정 </h2>
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
    <hr>
    <button @click="updateCite($route.params.id)"> 수정 </button>
    <button> 삭제 </button>
    </section>
    
    
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { database, storage } from '~/plugins/fbConn'
import Header from '~/components/Header'

export default {
  name: "editCite",
  components: {
    headerNav: Header
  },
  computed: {
    ...mapGetters({
      citeInfo: 'datasetModule/getCrntNewSite',
      
    })
  },
  methods: {
      ...mapActions({
        getCiteByID : 'datasetModule/getCiteByID',
        updateCite: 'datasetModule/updateCite'
      }),
    },
  mounted(){
    this.getCiteByID(this.$route.params.id)
  }
}
</script>