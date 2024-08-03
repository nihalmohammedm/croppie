import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'
import 'bulma/bulma.sass'

Vue.config.productionTip = false
Vue.use(VueCroppie);

new Vue({
  render: h => h(App),
}).$mount('#app')