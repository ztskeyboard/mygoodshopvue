import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import 'vant/lib/index.css';
import VueLazyload from 'vue-lazyload'

// 用原型设计给$bus赋一个vue实例
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false
//引入fastclick (移动端300毫秒延迟处理)
import FastClick from 'fastclick'

//解决移动端300毫秒延迟
FastClick.attach(document.body);

//懒加载
Vue.use(VueLazyload);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
