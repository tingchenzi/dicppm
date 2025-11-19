const path = require('path')

module.exports = {
  // 禁用 ESLint（构建时）
  lintOnSave: false,
  
  // 构建为库模式时的配置
  css: {
    extract: false, // 将样式内联到 JS 中，方便使用
    loaderOptions: {
      scss: {
        // 自动导入全局 SCSS 变量 (sass-loader v8 使用 prependData)
        prependData: `@import "@/styles/variables.scss";`
      }
    }
  },

  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    // 外部化依赖，不打包进库
    externals: [
      // 外部化原项目的依赖
      function(context, request, callback) {
        // 忽略原项目中的模块引用
        if (/^@\/api\//.test(request) ||
            /^@\/components\//.test(request) ||
            /^@\/mixins\//.test(request) ||
            /^@\/utils\//.test(request) ||
            /^@\/_MUlTIPAGES\//.test(request) ||
            /^@\/assets\/imgs\//.test(request) ||
            /\/components\/public\//.test(request) ||
            /vxe-table\/lib\/style\.css/.test(request)) {
          return callback(null, 'commonjs ' + request)
        }
        callback()
      },
      {
        vue: {
          root: 'Vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          amd: 'vue'
        },
        'element-ui': {
          root: 'ELEMENT',
          commonjs: 'element-ui',
          commonjs2: 'element-ui',
          amd: 'element-ui'
        },
        vuex: {
          root: 'Vuex',
          commonjs: 'vuex',
          commonjs2: 'vuex',
          amd: 'vuex'
        },
        'vue-router': {
          root: 'VueRouter',
          commonjs: 'vue-router',
          commonjs2: 'vue-router',
          amd: 'vue-router'
        },
        axios: 'axios',
        lodash: {
          root: '_',
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: 'lodash'
        },
        moment: 'moment',
        'vxe-table': 'vxe-table',
        'xe-utils': 'xe-utils',
        jsencrypt: 'jsencrypt'
      }
    ]
  },

  chainWebpack: config => {
    // 设置别名
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('@ppm', path.resolve(__dirname, 'src/crm3.0part7-ppm'))

    // 库模式下移除 HTML 相关插件
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('html')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
    }
  },

  // 开发服务器配置（用于示例项目）
  devServer: {
    port: 8090,
    open: true
  }
}
