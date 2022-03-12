import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入阿里字体图标库
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 导入vue-table-with-tree 插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入vue-quill-editor 插件,富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
axios.interceptors.request.use(config => {
  //console.log(config);
  // 为请求头对象添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //在最后必须return config
  return config;
})

Vue.config.productionTip = false

//全局注册
Vue.component('tree-table', TreeTable)

//全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局注册富文本编辑器,全局可用
Vue.use(VueQuillEditor, /* { default global options } */)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
