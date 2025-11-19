# 迁移指南

本指南帮助你从现有的 `crm3.0part7-ppm` 模块迁移到 `dic-crm3ppm-ui` 插件。

## 迁移步骤

### 1. 安装插件

```bash
npm install dic-crm3ppm-ui
# 或
yarn add dic-crm3ppm-ui
# 或
pnpm add dic-crm3ppm-ui
```

### 2. 创建 API 适配器

在你的项目中创建 `src/api/ppmAdapter.js`:

```javascript
// src/api/ppmAdapter.js
import OrderService from '@/api/order/OrderService'
import phoneOrderServe from '@/api/order/phoneOrderServe'

export default {
  async getOrderInfo(params) {
    return await OrderService.getOrderInfo(params)
  },
  
  async saveForm(data) {
    return await phoneOrderServe.saveForm(data)
  },
  
  async executeSql(params) {
    return await OrderService.executeSql(params)
  },
  
  async getProductInfo(params) {
    return await OrderService.getProductInfo(params)
  },
  
  async getDictData(params) {
    return await OrderService.getDictData(params)
  },
  
  async request(config) {
    return await OrderService.request(config)
  }
}
```

### 3. 注册插件

在 `main.js` 中注册插件:

```javascript
// main.js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import DicPPM from 'dic-crm3ppm-ui'
import 'dic-crm3ppm-ui/lib/dic-crm3ppm-ui.css'
import apiAdapter from '@/api/ppmAdapter'

Vue.use(ElementUI)
Vue.use(DicPPM, {
  apiAdapter: apiAdapter
})
```

### 4. 更新组件引用

#### 之前 (旧方式)

```javascript
// 旧的导入方式
import { deepClone } from '@/crm3.0part7-ppm/utils/clone'
```

#### 之后 (新方式)

```javascript
// 方式1: 使用全局属性
this.$ppmUtils.deepClone(obj)

// 方式2: 按需导入
import { utils } from 'dic-crm3ppm-ui'
utils.deepClone(obj)
```

### 5. 更新 API 调用

#### 之前

```javascript
import OrderService from '@/api/order/OrderService'

const result = await OrderService.getOrderInfo(params)
```

#### 之后

```javascript
// 使用插件提供的 API 服务
const result = await this.$ppmApi.getOrderInfo(params)
```

### 6. 移除旧代码

完成迁移后，可以删除以下内容:

1. 删除 `src/crm3.0part7-ppm` 目录
2. 从 `package.json` 中移除本地 `dic-crm3ppm-ui` 依赖
3. 更新所有相关的导入路径

## 代码对比

### 组件使用

#### 之前

```vue
<template>
  <div>
    <!-- 直接使用组件 -->
    <ppm-form :form-data="formData" />
  </div>
</template>

<script>
import { deepClone } from '@/crm3.0part7-ppm/utils/clone'

export default {
  methods: {
    handleData() {
      const cloned = deepClone(this.data)
    }
  }
}
</script>
```

#### 之后

```vue
<template>
  <div>
    <!-- 组件已全局注册，直接使用 -->
    <ppm-form :form-data="formData" />
  </div>
</template>

<script>
export default {
  methods: {
    handleData() {
      // 使用全局工具函数
      const cloned = this.$ppmUtils.deepClone(this.data)
    }
  }
}
</script>
```

### 自定义指令

#### 之前

```vue
<!-- 指令已在项目中注册 -->
<div v-fold="isExpanded">内容</div>
```

#### 之后

```vue
<!-- 插件自动注册指令，使用方式不变 -->
<div v-fold="isExpanded">内容</div>
```

## 常见问题

### Q: 插件安装后报错 "apiAdapter is required"

**A:** 确保在 `Vue.use()` 时传入了 `apiAdapter` 配置:

```javascript
Vue.use(DicPPM, {
  apiAdapter: yourApiAdapter  // 必需
})
```

### Q: 找不到某个组件

**A:** 确保组件名称正确，所有核心组件都已自动注册。如果是业务组件，可能需要按需导入。

### Q: 样式不生效

**A:** 确保导入了样式文件:

```javascript
import 'dic-crm3ppm-ui/lib/dic-crm3ppm-ui.css'
```

### Q: 如何在 TypeScript 项目中使用

**A:** 目前插件不提供 TypeScript 类型定义。如需使用，可以创建 `dic-crm3ppm-ui.d.ts`:

```typescript
declare module 'dic-crm3ppm-ui' {
  import { PluginObject } from 'vue'
  const DicPPM: PluginObject<any>
  export default DicPPM
}
```

## 性能优化

### 按需加载

如果只需要使用部分组件，可以按需导入:

```javascript
import { PpmForm, PpmData } from 'dic-crm3ppm-ui'

export default {
  components: {
    PpmForm,
    PpmData
  }
}
```

### 外部化依赖

在构建时，确保 `vue`、`element-ui` 等依赖被正确外部化，避免重复打包。

## 获取帮助

如果遇到问题:

1. 查看 [README.md](../README.md)
2. 查看 [API 文档](./API.md)
3. 提交 Issue: https://github.com/yourcompany/dic-crm3ppm-ui/issues
