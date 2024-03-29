import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./syntax/SyntaxHighlight";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;
Vue.use(VueCookies);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
