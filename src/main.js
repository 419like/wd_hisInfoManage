import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.use(ElementUI)

import axios from 'axios';
Vue.prototype.axios = axios;

import api from './fetch/api.js';
Vue.prototype.api = api;

new Vue({
  el: '#app',
  render: h => h(App)
})
