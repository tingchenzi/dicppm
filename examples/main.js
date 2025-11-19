/**
 * 示例项目入口文件
 * 用于开发和测试插件
 */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

// 导入插件
import DicPPM from '../src/index.js'

// 导入 API 适配器
import apiAdapter from './api/ppmAdapter'

Vue.config.productionTip = false

// 使用 Element UI
Vue.use(ElementUI)

// 使用 PPM 插件
Vue.use(DicPPM, {
  apiAdapter: apiAdapter
})

new Vue({
  render: h => h(App)
}).$mount('#app')
