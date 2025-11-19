# 快速开始指南

## 📋 步骤总览

1. ✅ 复制源代码
2. ✅ 安装依赖
3. ✅ 构建插件
4. ✅ 测试功能
5. ✅ 发布到 Git
6. ✅ 发布到 npm

## 🚀 详细步骤

### 步骤 1: 复制源代码

将原项目中的 PPM 模块复制到插件项目:

```bash
# 进入插件项目目录
cd e:\工作2\dic-crm3ppm-ui

# 运行复制脚本
node scripts/copy-source.js
```

或者手动复制:

```bash
# 手动复制整个 crm3.0part7-ppm 目录
# 从: e:\工作2\crm3.0-Enterprise\src\crm3.0part7-ppm
# 到: e:\工作2\dic-crm3ppm-ui\src\crm3.0part7-ppm
```

### 步骤 2: 安装依赖

```bash
cd e:\工作2\dic-crm3ppm-ui
npm install
```

### 步骤 3: 构建插件

```bash
# 构建生产版本
npm run build

# 查看构建产物
dir lib
```

构建成功后，`lib` 目录下应该有:
- `dic-crm3ppm-ui.umd.js` - UMD 格式
- `dic-crm3ppm-ui.umd.min.js` - 压缩版本
- `dic-crm3ppm-ui.esm.js` - ES Module 格式

### 步骤 4: 本地测试

```bash
# 启动开发服务器
npm run dev
```

浏览器会自动打开 `http://localhost:8090`，测试以下功能:
- ✅ 插件是否正确加载
- ✅ 自定义指令是否工作
- ✅ 工具函数是否可用

### 步骤 5: 初始化 Git 仓库

```bash
# 初始化 Git
git init

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourcompany/dic-crm3ppm-ui.git

# 或使用 SSH
git remote add origin git@github.com:yourcompany/dic-crm3ppm-ui.git

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化 PPM 插件项目 v1.0.0"

# 推送到远程仓库
git push -u origin main

# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 步骤 6: 发布到 npm

#### 选项 A: 发布到公共 npm

```bash
# 登录 npm
npm login

# 发布
npm publish
```

#### 选项 B: 发布到私有 npm

```bash
# 登录私有仓库
npm login --registry=http://your-npm-registry.com

# 发布到私有仓库
npm publish --registry=http://your-npm-registry.com
```

#### 选项 C: 搭建私有 npm (Verdaccio)

```bash
# 全局安装 Verdaccio
npm install -g verdaccio

# 启动服务
verdaccio
# 默认运行在 http://localhost:4873

# 在新终端中，配置 npm 源
npm set registry http://localhost:4873

# 创建用户
npm adduser --registry http://localhost:4873

# 发布包
npm publish --registry http://localhost:4873
```

## 🎯 在其他项目中使用

### 1. 安装插件

```bash
# 从 npm 安装
npm install dic-crm3ppm-ui

# 从 Git 安装
npm install git+https://github.com/yourcompany/dic-crm3ppm-ui.git

# 从私有 npm 安装
npm install dic-crm3ppm-ui --registry=http://your-npm-registry.com
```

### 2. 创建 API 适配器

在你的项目中创建 `src/api/ppmAdapter.js`:

```javascript
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

### 3. 在 main.js 中注册

```javascript
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

### 4. 在组件中使用

```vue
<template>
  <div>
    <!-- 组件已全局注册，直接使用 -->
    <ppm-form :form-data="formData" />
    
    <!-- 使用自定义指令 -->
    <el-button v-prevent-re-click="handleSubmit">提交</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    handleSubmit() {
      // 使用全局工具函数
      const cloned = this.$ppmUtils.deepClone(this.formData)
      
      // 使用 API 服务
      this.$ppmApi.saveForm(cloned)
    }
  }
}
</script>
```

## 📝 检查清单

在发布前，请确保:

- [ ] 源代码已完整复制
- [ ] 所有依赖已安装
- [ ] 构建成功，lib 目录有产物
- [ ] 本地测试通过
- [ ] README.md 已更新
- [ ] package.json 版本号正确
- [ ] Git 仓库已创建并推送
- [ ] npm 包已成功发布
- [ ] 在测试项目中验证可用

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run build:watch      # 监听模式构建
npm run lint             # 代码检查

# Git
git status               # 查看状态
git add .                # 添加所有文件
git commit -m "message"  # 提交
git push                 # 推送
git tag v1.0.0           # 创建标签

# npm
npm version patch        # 更新补丁版本
npm version minor        # 更新次版本
npm version major        # 更新主版本
npm publish              # 发布包
npm info dic-crm3ppm-ui  # 查看包信息
```

## 📚 更多文档

- [README.md](./README.md) - 项目介绍和基础用法
- [API.md](./docs/API.md) - 完整 API 文档
- [MIGRATION.md](./docs/MIGRATION.md) - 迁移指南
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - 详细部署指南
- [CHANGELOG.md](./CHANGELOG.md) - 版本更新日志

## 🆘 获取帮助

如果遇到问题:

1. 查看文档
2. 检查 [常见问题](./docs/MIGRATION.md#常见问题)
3. 提交 Issue
4. 联系维护团队

## 🎉 完成！

恭喜！你已经成功创建了一个可复用的 PPM 插件包。现在可以在多个项目中使用它了！
