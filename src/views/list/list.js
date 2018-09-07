import Vue from 'vue';

import App from './App';
import router from './router'

/* eslint-disable no-new */
console.log("222222222222222222222")


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')