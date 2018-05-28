/* eslint-disable */
// User Level 
// superUser
// citeManager
// guest
// researcher
import { firebase_, auth } from "~/plugins/fbConn";
import { AbilityBuilder } from '@casl/ability';

const state = {
  user: {
    displayName: "",
    last: "",
    createdAt: "",
    email: "",
    emailVerified: "",
    phoneNumber: "",
    photoURL: "",
    accessToken: ""
  },
  privilege: 'superUser',
  histories: [],
  errorLogin: {}
}

const getters = {
  getUserInfo: state => state.user,
  getPrivilege: state => state.privilege,
  getHistories: state => state.histories
}

const actions = {
  login({commit}, userInfo){
    // updateUserInfo()
    var email = "pbshop1001@gmail.com";
      var password = "runy1001";
      auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        commit("failLogin", error)
        errorLogin = error
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

  },
  logout({commit}, userInfo){
    // updateUserInfo()
    auth.signOut();
  },
  update({commit}, userInfo){
    // SuperAdmin level required
  },
  delete({commit}, userInfo){
    // SuperAdmin level required
  },
  getHistories({commit}){

  },
  newHistories({commit}, event){

  },
  getUserInfo({commit}, user){
    commit("updateUserInfo", user)
  }
}

const mutations = {
  updateUserInfo(state, data){
    state.user = data
  },
  failLogin(state, data){
    state.failLogin = data
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