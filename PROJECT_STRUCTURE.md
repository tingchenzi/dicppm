# 项目结构说明

```
dic-crm3ppm-ui/
├── src/                          # 源代码目录
│   ├── index.js                 # 插件入口文件
│   ├── directives/              # 自定义指令
│   │   └── index.js            # 指令集合（fold, preventReClick, debounce）
│   ├── services/                # 服务层
│   │   └── ApiService.js       # API 服务（适配器模式）
│   └── crm3.0part7-ppm/        # PPM 源代码（从原项目复制）
│       ├── core/               # 核心组件
│       │   ├── index.vue       # 主入口组件
│       │   ├── ppmForm.vue     # 动态表单组件
│       │   ├── ppmData.vue     # 数据展示组件
│       │   ├── ppmTab.vue      # 标签页组件
│       │   └── ...
│       ├── plugins/            # 业务插件（264个）
│       │   ├── sub-pro/        # 可选包插件
│       │   ├── add-pro-list/   # 添加产品列表
│       │   └── ...
│       ├── prodDuct/           # 产品配置（160个）
│       │   └── Events/
│       │       └── accept/     # 受理事件
│       ├── utils/              # 工具函数
│       │   └── clone.js        # 深拷贝等工具
│       ├── commons/            # 公共模块
│       ├── styles/             # 样式文件
│       └── build/              # 原构建配置（已废弃）
│
├── examples/                     # 示例项目
│   ├── main.js                  # 示例入口
│   ├── App.vue                  # 示例应用
│   └── api/
│       └── ppmAdapter.js        # API 适配器示例
│
├── lib/                          # 构建输出（npm 发布）
│   ├── dic-crm3ppm-ui.umd.js    # UMD 格式
│   ├── dic-crm3ppm-ui.umd.min.js # 压缩版本
│   └── dic-crm3ppm-ui.esm.js    # ES Module 格式
│
├── docs/                         # 文档目录
│   ├── API.md                   # API 文档
│   ├── MIGRATION.md             # 迁移指南
│   └── DEPLOYMENT.md            # 部署指南
│
├── scripts/                      # 脚本目录
│   ├── copy-source.js           # 复制源代码脚本
│   ├── init-project.bat         # 项目初始化脚本（Windows）
│   └── publish.bat              # 发布脚本（Windows）
│
├── public/                       # 公共资源
│   └── index.html               # HTML 模板
│
├── package.json                  # 项目配置
├── vue.config.js                 # Vue CLI 配置
├── babel.config.js               # Babel 配置
├── .eslintrc.js                  # ESLint 配置
├── .gitignore                    # Git 忽略文件
├── .npmignore                    # npm 忽略文件
├── README.md                     # 项目说明
├── CHANGELOG.md                  # 更新日志
├── QUICK_START.md                # 快速开始指南
└── PROJECT_STRUCTURE.md          # 本文件
```

## 核心文件说明

### src/index.js
插件的主入口文件，负责：
- 自动注册所有 Vue 组件
- 注册自定义指令
- 初始化 API 服务
- 挂载全局属性和方法

### src/directives/index.js
自定义指令集合：
- `v-fold`: 折叠控制
- `v-prevent-re-click`: 防止重复点击（带防抖）
- `v-debounce`: 防抖指令

### src/services/ApiService.js
API 服务层，使用适配器模式：
- 解耦业务逻辑和具体实现
- 提供统一的 API 调用接口
- 支持不同项目的后端对接

### src/crm3.0part7-ppm/
从原项目复制的 PPM 源代码：
- **core/**: 核心组件（8个）
- **plugins/**: 业务插件（264个）
- **prodDuct/**: 产品配置（160个）
- **utils/**: 工具函数
- **commons/**: 公共模块
- **styles/**: 样式文件

## 构建产物

### lib/dic-crm3ppm-ui.umd.js
UMD 格式，支持：
- `<script>` 标签直接引入
- AMD 模块加载器
- CommonJS 环境

### lib/dic-crm3ppm-ui.esm.js
ES Module 格式，支持：
- 现代打包工具（Webpack, Rollup, Vite）
- Tree Shaking（按需加载）

## 开发流程

1. **初始化项目**
   ```bash
   scripts\init-project.bat
   ```

2. **开发调试**
   ```bash
   npm run dev
   ```

3. **构建插件**
   ```bash
   npm run build
   ```

4. **发布**
   ```bash
   scripts\publish.bat
   ```

## 文件大小

- 源代码: ~5MB（包含所有组件和配置）
- 构建后: ~2MB（压缩后）
- Gzip 后: ~500KB

## 依赖关系

### peerDependencies（需要项目提供）
- vue: ^2.6.11
- element-ui: ^2.8.2
- vuex: ^3.4.0

### dependencies（插件自带）
- axios: ^0.21.1
- lodash: ^4.17.21
- moment: ^2.30.1

### devDependencies（开发时需要）
- @vue/cli-service
- vue-template-compiler
- babel-eslint
- 等...

## 外部化依赖

以下依赖不会打包进插件，需要项目自行提供：
- Vue
- Element UI
- Vuex
- Vue Router
- axios
- lodash
- moment

这样可以：
- 减小包体积
- 避免版本冲突
- 共享项目依赖
