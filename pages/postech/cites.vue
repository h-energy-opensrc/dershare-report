<template>
  <section>
    <header-nav></header-nav>
    <section class="ma3">
      <h2> 사이트 리스트 </h2>
      <table class="collapse ba br2 b--black-10 pv2 ph3 mt4">
      <tbody>
        <tr class="striped--near-white ">
          <th class="pv2 ph3 tl f6 fw6 ttu">
            어카운트: 고객이름
          </th>
          <th class="pv2 ph3 tl f6 fw6 ttu">계약전력</th>
          <th class="tr f6 ttu fw6 pv2 ph3">검침일</th>
          <th class="tr f6 ttu fw6 pv2 ph3">용도</th>
          <th class="tr f6 ttu fw6 pv2 ph3">Data</th>
          <th class="tr f6 ttu fw6 pv2 ph3">Data(No NAs)</th>
          <th class="tr f6 ttu fw6 pv2 ph3">Last Update</th>
          <th class="tr f6 ttu fw6 pv2 ph3">Avail</th>
        </tr>
        <tr class="striped--near-white" v-for="(cite, idx) in cites" :key="idx">
          <td class="pv2 ph3">
            <nuxt-link :to="{ path: `cite/edit/${cite.id}` }">
              <a class="link dim gray    b f6 f5-ns dib mr3" title="About">{{cite.account}}: {{cite.bizName}} </a>
            </nuxt-link>
          </td>
          <td class="pv2 ph3">{{cite.actual}}</td>
          <td class="pv2 ph3">{{cite.meterDay}}</td>
          <td class="pv2 ph3">{{cite.officeType}}</td>
          <td class="pv2 ph3">
            <a :href="cite.dataLink">Download</a>
          </td>
          <td class="pv2 ph3">
            <a :href="cite.dataNALink">Download</a>
          </td>
          <td class="pv2 ph3">...</td>
          <td class="pv2 ph3">{{cite.avail}}</td>
        </tr>
      </tbody></table>
    </section>
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '~/components/HeaderPostech'
export default {
  name: 'listCite',
  components: {
    headerNav: Header
  },
  computed: {
    ...mapGetters({
      datasets: 'datasetModule/getAllDatasets',
      cites: 'datasetModule/getCites',
    })
  },
  created(){
    this.$store.dispatch('datasetModule/getAllCites')
  }
}
</script>