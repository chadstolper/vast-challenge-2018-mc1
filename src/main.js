import Vue from 'vue'
import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(VueSweetalert2);

export const kasiosEventBus = new Vue();
export const speciesEventBus = new Vue();

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // TODO: get the dimensions correct
  // iconRetinaUrl: require('../public/data/icons/marker.png'),
  // iconUrl: require('../public/data/icons/marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app')
