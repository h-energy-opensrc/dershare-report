/* eslint-disable */

const state = {
  user: null,
  histories: []
}

const getters = {
  getUserInfo: state => state.user
}

const actions = {
  login({commit}, userInfo){},
  update({commit}, userInfo){},
  delete({commit}, userInfo){},
  getHistories({commit}, userInfo){},
  newHistories({commit}, userInfo){}

}

const mutations = {
  loginUser(state, data){
    
  },
  createUser(state, data) {
    state.datasets = data
  },
  updateUser(state, data) {
    state.datasets = data
  },
  deleteUser(state, data) {
    state.datasets = data
  },
}

export default {
  namespaced: true,
  state, 
  getters, 
  actions,
  mutations
}