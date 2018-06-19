import Vue from 'vue'
import App from './App.vue'

export const kasiosEventBus = new Vue();
export const speciesEventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app')
