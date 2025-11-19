/**
 * dic-crm3ppm-ui 插件入口文件
 * 天源迪科 PPM 动态表单插件
 */

// 自动导入所有 Vue 组件
const requireContext = require.context('./crm3.0part7-ppm', true, /\.vue$/)

// 导入自定义指令
import directives from './directives'

// 导入 API 服务
import ApiService from './services/ApiService'

// 导入工具函数
import * as utils from './crm3.0part7-ppm/utils'

// 版本号
const version = '1.0.0'

/**
 * 插件安装函数
 * @param {Vue} Vue - Vue 构造函数
 * @param {Object} options - 配置选项
 * @param {Object} options.apiAdapter - API 适配器（必需）
 * @param {Object} options.router - Vue Router 实例（可选）
 * @param {Object} options.store - Vuex Store 实例（可选）
 * @param {Object} options.config - 全局配置（可选）
 */
const install = (Vue, options = {}) => {
  // 防止重复安装
  if (install.installed) {
    console.warn('[dic-crm3ppm-ui] already installed.')
    return
  }
  install.installed = true

  // 验证必需参数
  if (!options.apiAdapter) {
    console.error('[dic-crm3ppm-ui] apiAdapter is required!')
    console.info('Usage: Vue.use(DicPPM, { apiAdapter: yourApiAdapter })')
  }

  // 初始化 API 服务
  if (options.apiAdapter) {
    ApiService.setAdapter(options.apiAdapter)
  }

  // 注册自定义指令
  Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key])
  })

  // 自动注册所有组件
  requireContext.keys().forEach((filename) => {
    // 只注册 core 目录下的组件和 plugins 目录下的 index.vue
    const pathParts = filename.split('/')
    const isCore = pathParts[1] === 'core'
    const isPluginIndex = pathParts[1] === 'plugins' && filename.endsWith('/index.vue')
    const isProductIndex = pathParts[1] === 'prodDuct' && filename.endsWith('/index.vue')

    if (!isCore && !isPluginIndex && !isProductIndex) {
      return
    }

    try {
      const componentConfig = requireContext(filename)
      const component = componentConfig.default || componentConfig

      // 注册组件
      if (component.name) {
        Vue.component(component.name, component)
      }
    } catch (error) {
      // 跳过有依赖问题的组件
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[dic-crm3ppm-ui] Failed to load component: ${filename}`, error.message)
      }
    }
  })

  // 挂载全局配置
  Vue.prototype.$ppmConfig = {
    version,
    ...options.config,
    router: options.router,
    store: options.store
  }

  // 挂载工具函数
  Vue.prototype.$ppmUtils = utils

  // 挂载 API 服务
  Vue.prototype.$ppmApi = ApiService

  console.log(`[dic-crm3ppm-ui] v${version} installed successfully.`)
}

// 支持 script 标签直接引入
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 导出插件
export default {
  install,
  version
}

// 导出工具和服务供按需使用
export {
  utils,
  ApiService
}
