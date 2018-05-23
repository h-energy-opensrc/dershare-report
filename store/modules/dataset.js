/* eslint-disable */
import axios from 'axios'
import { database, storage } from '~/plugins/fbConn'

const state = {
  datasets: [1,2,3,4],
  cites: [],
  crntNewSite : {
    bizName: "", account: "", pw: "", applied: 0, actual: 0, type: "",
    meterDay: "", addr: "", loc: {log:0, lat:0}, officeType: "", refName: "", status: ""
  }
}

const getters = {
  getAllDatasets: state => state.datasets,
  getCrntNewSite: state => state.crntNewSite,
  getCites : state => state.cites
}

const actions = {
  getCiteByID({commit}, id){
    var ref = database.ref('cites').child(id)
    ref.on('value', (snap)=> {
      var citeInfo = snap.val()
      commit('setCiteInfo', citeInfo)
    })
  },
  getAllDatasetsA({ commit }) {
    const products = [1, 2, 3]
    commit('setDatasets', products)
  },
  getAllCites({ commit }){
    var cites = []
    var ref = database.ref('cites')
    ref.on('value', (snap)=> {
      snap.forEach((ind)=>{
        var cite = ind.val()
        cite.id = ind.key
        cites.push(cite)
      })
      commit('setAllCites', cites)
    })
  },
  addNewCite({state, commit}){
    var ref = database.ref('cites')
    ref.push(state.crntNewSite)
    state.crntNewSite = {
      bizName: "", account: "", pw: "", applied: 0, actual: 0, type: "",
      meterDay: "", addr: "", loc: {log:0, lat:0}, officeType: "", refName: "", status: ""
    }
  },
  updateCite({state}, id){
    // update cites 
    var ref = database.ref(`cites/${id}`)
    ref.update(state.crntNewSite)
  }
}

const mutations = {
  setDatasets(state, data) {
    state.datasets = data
  },
  setCiteInfo(state, data){
    state.crntNewSite = data
  },
  setAllCites(state, data) {
    state.cites = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
