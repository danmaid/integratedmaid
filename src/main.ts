import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export interface Hierarchy {
  digest: string;
  text?: string;
  children?: Hierarchy[];
  parent?: Hierarchy;
}
