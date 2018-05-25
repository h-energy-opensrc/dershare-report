/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import datasetModule from './modules/dataset'
import userModule from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const createStore = () => {
    return new Vuex.Store({
        modules: {
          datasetModule: datasetModule,
          userModule: userModule
        },
        //strict: debug,
        //plugins: debug ? [] : []
    })
}

export default createStore