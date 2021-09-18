import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
  },
  getters: {
    getAuthenticationStatus: state => {
      return state.isAuthenticated;
    }
  },
  mutations: {
    // Change authentication
    setAuthentication(state, value: boolean) {
      state.isAuthenticated = value;
    }
  },
  actions: {},
  modules: {},
});
