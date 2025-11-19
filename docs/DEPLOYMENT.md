# 部署指南

本指南介绍如何将 `dic-crm3ppm-ui` 插件发布到 Git 仓库和 npm 仓库。

## 前置准备

### 1. 复制源代码

首先需要将原项目中的 PPM 模块复制到插件项目中:

```bash
# 方式1: 使用脚本（推荐）
cd dic-crm3ppm-ui
node scripts/copy-source.js

# 方式2: 手动复制
# 将 crm3.0-Enterprise/src/crm3.0part7-ppm 目录
# 复制到 dic-crm3ppm-ui/src/crm3.0part7-ppm
```

### 2. 安装依赖

```bash
cd dic-crm3ppm-ui
npm install
```

### 3. 测试构建

```bash
# 构建插件
npm run build

# 查看构建产物
ls lib/
# 应该看到:
# - dic-crm3ppm-ui.umd.js
# - dic-crm3ppm-ui.umd.min.js
# - dic-crm3ppm-ui.esm.js
```

### 4. 本地测试

```bash
# 启动示例项目
npm run dev

# 浏览器会自动打开 http://localhost:8090
# 测试各项功能是否正常
```

## Git 仓库配置

### 1. 初始化 Git 仓库

```bash
cd dic-crm3ppm-ui
git init
```

### 2. 添加远程仓库

```bash
# 方式1: 使用 HTTPS
git remote add origin https://github.com/yourcompany/dic-crm3ppm-ui.git

# 方式2: 使用 SSH
git remote add origin git@github.com:yourcompany/dic-crm3ppm-ui.git
```

### 3. 首次提交

```bash
# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化项目 - PPM 动态表单插件 v1.0.0"

# 推送到远程仓库
git push -u origin main
```

### 4. 创建版本标签

```bash
# 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

## npm 发布

### 1. 配置 npm 账号

```bash
# 登录 npm（公共仓库）
npm login

# 或登录私有仓库
npm login --registry=http://your-npm-registry.com
```

### 2. 更新版本号

```bash
# 更新补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 更新次版本 (1.0.0 -> 1.1.0)
npm version minor

# 更新主版本 (1.0.0 -> 2.0.0)
npm version major
```

### 3. 发布到 npm

```bash
# 发布到公共 npm
npm publish

# 发布到私有 npm
npm publish --registry=http://your-npm-registry.com

# 发布 beta 版本
npm publish --tag beta
```

### 4. 验证发布

```bash
# 查看包信息
npm info dic-crm3ppm-ui

# 在新项目中测试安装
npm install dic-crm3ppm-ui
```

## 私有 npm 仓库

### 使用 Verdaccio（推荐）

#### 1. 安装 Verdaccio

```bash
npm install -g verdaccio
```

#### 2. 启动服务

```bash
verdaccio
# 默认运行在 http://localhost:4873
```

#### 3. 配置 npm 源

```bash
# 设置私有源
npm set registry http://localhost:4873

# 或在项目中配置 .npmrc
echo "registry=http://localhost:4873" > .npmrc
```

#### 4. 创建用户并发布

```bash
# 创建用户
npm adduser --registry http://localhost:4873

# 发布包
npm publish --registry http://localhost:4873
```

### 使用 npm 私有仓库

如果公司有私有 npm 仓库（如 Nexus、Artifactory），配置方式类似:

```bash
# 配置私有源
npm set registry http://your-npm-registry.com

# 登录
npm login --registry http://your-npm-registry.com

# 发布
npm publish --registry http://your-npm-registry.com
```

## 在其他项目中使用

### 1. 安装插件

```bash
# 从公共 npm 安装
npm install dic-crm3ppm-ui

# 从私有 npm 安装
npm install dic-crm3ppm-ui --registry=http://your-npm-registry.com

# 从 Git 仓库安装
npm install git+https://github.com/yourcompany/dic-crm3ppm-ui.git

# 安装特定版本
npm install dic-crm3ppm-ui@1.0.0
```

### 2. 在项目中使用

参考 [MIGRATION.md](./MIGRATION.md) 进行集成。

## 持续集成 (CI/CD)

### GitHub Actions 示例

创建 `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### GitLab CI 示例

创建 `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - publish

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - lib/

publish:
  stage: publish
  only:
    - tags
  script:
    - echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
    - npm publish
```

## 版本管理策略

### 语义化版本

遵循 [Semantic Versioning](https://semver.org/):

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增
- **修订号 (PATCH)**: 向下兼容的问题修正

### 发布流程

1. **开发分支**: `develop`
2. **功能分支**: `feature/xxx`
3. **发布分支**: `release/x.x.x`
4. **主分支**: `main` (稳定版本)

```bash
# 创建功能分支
git checkout -b feature/new-component develop

# 开发完成后合并到 develop
git checkout develop
git merge feature/new-component

# 准备发布
git checkout -b release/1.1.0 develop
npm version minor
npm run build

# 合并到 main 并打标签
git checkout main
git merge release/1.1.0
git tag -a v1.1.0 -m "Release 1.1.0"
git push origin main --tags

# 发布到 npm
npm publish
```

## 常见问题

### Q: 发布时提示 "You do not have permission to publish"

**A:** 检查:
1. 是否已登录 npm: `npm whoami`
2. 包名是否已被占用
3. 是否有发布权限

### Q: 如何撤销已发布的版本

**A:** 使用 `npm unpublish`:

```bash
# 撤销特定版本（发布后24小时内）
npm unpublish dic-crm3ppm-ui@1.0.0

# 撤销整个包（谨慎使用）
npm unpublish dic-crm3ppm-ui --force
```

### Q: 如何更新已发布的包

**A:** 
1. 修改代码
2. 更新版本号: `npm version patch/minor/major`
3. 重新构建: `npm run build`
4. 发布: `npm publish`

## 安全建议

1. **不要提交敏感信息**: 使用 `.gitignore` 和 `.npmignore`
2. **使用 npm token**: 在 CI/CD 中使用环境变量存储 token
3. **启用 2FA**: 在 npm 账号中启用两步验证
4. **定期更新依赖**: 使用 `npm audit` 检查安全漏洞

## 监控和维护

### 监控下载量

```bash
# 查看包信息
npm info dic-crm3ppm-ui

# 查看下载统计
npm-stat dic-crm3ppm-ui
```

### 收集反馈

1. 在 GitHub 上启用 Issues
2. 创建讨论区
3. 提供联系方式

### 版本维护

1. 及时修复 bug
2. 定期更新依赖
3. 保持文档更新
4. 维护 CHANGELOG
