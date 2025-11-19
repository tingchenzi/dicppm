# dic-crm3ppm-ui

天源迪科 PPM 动态表单插件 - 企业级 Vue 2.x 组件库

## 📦 安装

```bash
# 使用 npm
npm install dic-crm3ppm-ui

# 使用 yarn
yarn add dic-crm3ppm-ui

# 使用 pnpm
pnpm add dic-crm3ppm-ui
```

## 🚀 快速开始

### 完整引入

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import DicPPM from 'dic-crm3ppm-ui'
import 'dic-crm3ppm-ui/lib/dic-crm3ppm-ui.css'

Vue.use(ElementUI)

// 配置 API 适配器
import apiAdapter from './api/ppmAdapter'

Vue.use(DicPPM, {
  apiAdapter: apiAdapter
})
```

### 按需引入

```javascript
import { PpmForm, PpmData } from 'dic-crm3ppm-ui'

export default {
  components: {
    PpmForm,
    PpmData
  }
}
```

## 🔌 API 适配器配置

插件需要配置 API 适配器来对接你的后端服务。创建 `api/ppmAdapter.js`:

```javascript
import OrderService from '@/api/order/OrderService'
import phoneOrderServe from '@/api/order/phoneOrderServe'

export default {
  // 获取订单信息
  async getOrderInfo(params) {
    return await OrderService.getOrderInfo(params)
  },
  
  // 保存表单数据
  async saveForm(data) {
    return await phoneOrderServe.saveForm(data)
  },
  
  // 执行 SQL 查询
  async executeSql(params) {
    return await OrderService.executeSql(params)
  },
  
  // 获取产品信息
  async getProductInfo(params) {
    return await OrderService.getProductInfo(params)
  },
  
  // 查询字典数据
  async getDictData(params) {
    return await OrderService.getDictData(params)
  },
  
  // 通用请求方法
  async request(config) {
    return await OrderService.request(config)
  }
}
```

## 📚 核心组件

### PpmForm - 动态表单组件

```vue
<template>
  <ppm-form
    ref="ppmForm"
    :form-data="formData"
    :config="formConfig"
    :disabled="false"
    @submit="handleSubmit"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      formConfig: {
        // 表单配置
      }
    }
  },
  methods: {
    handleSubmit(data) {
      console.log('表单提交:', data)
    },
    handleChange(key, value) {
      console.log('表单变化:', key, value)
    }
  }
}
</script>
```

### PpmData - 数据展示组件

```vue
<template>
  <ppm-data
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
  />
</template>
```

### PpmTab - 标签页组件

```vue
<template>
  <ppm-tab
    :tabs="tabs"
    :active-tab="activeTab"
    @tab-change="handleTabChange"
  />
</template>
```

## 🎨 自定义指令

插件提供以下自定义指令：

### v-fold - 折叠控制

```vue
<div v-fold="isExpanded">
  <div data-ctrl="1">可折叠内容</div>
</div>
```

### v-prevent-re-click - 防止重复点击

```vue
<el-button v-prevent-re-click="[handleClick, params, 1000]">
  提交
</el-button>
```

### v-debounce - 防抖

```vue
<el-button v-debounce="2000" @click="handleSearch">
  搜索
</el-button>
```

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/yourcompany/dic-crm3ppm-ui.git

# 安装依赖
cd dic-crm3ppm-ui
npm install

# 开发模式（带示例）
npm run dev

# 构建库
npm run build

# 监听模式构建
npm run build:watch
```

## 📁 项目结构

```
dic-crm3ppm-ui/
├── src/                      # 源代码
│   ├── index.js             # 插件入口
│   ├── core/                # 核心组件
│   ├── plugins/             # 业务插件
│   ├── prodDuct/            # 产品配置
│   ├── utils/               # 工具函数
│   ├── commons/             # 公共模块
│   ├── styles/              # 样式文件
│   └── directives/          # 自定义指令
├── examples/                # 示例项目
├── lib/                     # 构建输出
├── docs/                    # 文档
└── tests/                   # 测试文件
```

## 📝 从现有项目迁移

如果你已经在使用 `crm3.0part7-ppm` 模块，迁移步骤如下：

1. **安装插件**
   ```bash
   npm install dic-crm3ppm-ui
   ```

2. **创建 API 适配器**
   ```javascript
   // src/api/ppmAdapter.js
   export default {
     // 映射现有的 API 方法
   }
   ```

3. **注册插件**
   ```javascript
   // main.js
   import DicPPM from 'dic-crm3ppm-ui'
   import apiAdapter from '@/api/ppmAdapter'
   
   Vue.use(DicPPM, { apiAdapter })
   ```

4. **移除旧的引用**
   - 删除 `src/crm3.0part7-ppm` 目录
   - 更新导入路径

## 🔄 版本更新

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

## 📄 许可证

ISC © 天源迪科CRM3.0重构项目组

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- 邮箱: support@yourcompany.com
- 项目主页: https://github.com/yourcompany/dic-crm3ppm-ui
