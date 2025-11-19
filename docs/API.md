# API 文档

## 安装

```javascript
import Vue from 'vue'
import DicPPM from 'dic-crm3ppm-ui'
import apiAdapter from './api/ppmAdapter'

Vue.use(DicPPM, {
  apiAdapter: apiAdapter,  // 必需
  router: router,          // 可选
  store: store,            // 可选
  config: {}               // 可选
})
```

## 配置选项

### apiAdapter (必需)

API 适配器对象，用于对接后端服务。

```javascript
{
  apiAdapter: {
    getOrderInfo: async (params) => { /* ... */ },
    saveForm: async (data) => { /* ... */ },
    executeSql: async (params) => { /* ... */ },
    // ... 其他方法
  }
}
```

### router (可选)

Vue Router 实例，某些组件可能需要路由功能。

### store (可选)

Vuex Store 实例，某些组件可能需要状态管理。

### config (可选)

全局配置对象。

## 核心组件

### PpmForm

动态表单组件。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| formData | 表单数据 | Object | {} |
| config | 表单配置 | Object | {} |
| disabled | 是否禁用 | Boolean | false |

#### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| submit | 表单提交 | (data) |
| change | 表单变化 | (key, value) |

#### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| validate | 验证表单 | - |
| resetFields | 重置表单 | - |

### PpmData

数据展示组件。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 表格数据 | Array | [] |
| columns | 列配置 | Array | [] |
| pagination | 分页配置 | Object | null |

## 自定义指令

### v-fold

折叠控制指令。

```vue
<div v-fold="isExpanded">
  <div data-ctrl="1">可折叠内容</div>
</div>
```

### v-prevent-re-click

防止重复点击指令。

```vue
<!-- 基础用法 -->
<el-button v-prevent-re-click="handleClick">按钮</el-button>

<!-- 带参数和延迟时间 -->
<el-button v-prevent-re-click="[handleClick, params, 1000]">按钮</el-button>
```

### v-debounce

防抖指令。

```vue
<el-button v-debounce="2000" @click="handleClick">按钮</el-button>
```

## 全局属性

### $ppmConfig

全局配置对象。

```javascript
this.$ppmConfig.version  // 插件版本
this.$ppmConfig.router   // 路由实例
this.$ppmConfig.store    // Store 实例
```

### $ppmUtils

工具函数集合。

```javascript
this.$ppmUtils.deepClone(obj)      // 深拷贝
this.$ppmUtils.deepAssign(t, s)    // 深度合并
```

### $ppmApi

API 服务实例。

```javascript
await this.$ppmApi.getOrderInfo(params)
await this.$ppmApi.saveForm(data)
await this.$ppmApi.executeSql(params)
```

## API 适配器接口

### 必需方法

#### getOrderInfo(params)

获取订单信息。

**参数:**
- `params` (Object): 查询参数

**返回:**
- Promise<Object>: 订单信息

#### saveForm(data)

保存表单数据。

**参数:**
- `data` (Object): 表单数据

**返回:**
- Promise<Object>: 保存结果

#### executeSql(params)

执行 SQL 查询。

**参数:**
- `params` (Object): SQL 参数
  - `interFaceType` (String): 接口类型
  - `sqlId` (String): SQL ID
  - `paramStr` (String): 参数字符串

**返回:**
- Promise<Object>: 查询结果

### 可选方法

#### getProductInfo(params)

获取产品信息。

#### getDictData(params)

查询字典数据。

#### request(config)

通用请求方法。

## 工具函数

### deepClone(obj)

深拷贝对象。

```javascript
import { deepClone } from 'dic-crm3ppm-ui'

const cloned = deepClone(originalObj)
```

### deepAssign(target, source)

深度合并对象。

```javascript
import { deepAssign } from 'dic-crm3ppm-ui'

const merged = deepAssign(target, source)
```
