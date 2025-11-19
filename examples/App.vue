<template>
  <div id="app">
    <div class="header">
      <h1>dic-crm3ppm-ui 示例</h1>
      <p>天源迪科 PPM 动态表单插件演示</p>
    </div>
    
    <div class="container">
      <el-card class="demo-card">
        <div slot="header">
          <span>插件信息</span>
        </div>
        <div>
          <p><strong>版本:</strong> {{ $ppmConfig.version }}</p>
          <p><strong>状态:</strong> <el-tag type="success">已加载</el-tag></p>
          <p><strong>API 适配器:</strong> <el-tag>已配置</el-tag></p>
        </div>
      </el-card>

      <el-card class="demo-card">
        <div slot="header">
          <span>自定义指令演示</span>
        </div>
        <div>
          <h3>v-prevent-re-click 防止重复点击</h3>
          <el-button 
            type="primary" 
            v-prevent-re-click="handleClick"
          >
            点击我（1秒内只能点击一次）
          </el-button>
          <p>点击次数: {{ clickCount }}</p>

          <h3 style="margin-top: 20px;">v-debounce 防抖</h3>
          <el-button 
            type="success" 
            v-debounce="2000"
            @click="handleDebounceClick"
          >
            点击我（2秒防抖）
          </el-button>
          <p>防抖点击次数: {{ debounceCount }}</p>

          <h3 style="margin-top: 20px;">v-fold 折叠</h3>
          <el-button @click="isExpanded = !isExpanded">
            {{ isExpanded ? '收起' : '展开' }}
          </el-button>
          <div v-fold="isExpanded" style="margin-top: 10px;">
            <div data-ctrl="1" style="padding: 10px; background: #f0f0f0;">
              这是可折叠的内容
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="demo-card">
        <div slot="header">
          <span>工具函数演示</span>
        </div>
        <div>
          <el-button @click="testUtils">测试工具函数</el-button>
          <pre v-if="utilsResult">{{ utilsResult }}</pre>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      clickCount: 0,
      debounceCount: 0,
      isExpanded: false,
      utilsResult: null
    }
  },
  methods: {
    handleClick() {
      this.clickCount++
      this.$message.success(`点击成功！当前次数: ${this.clickCount}`)
    },
    handleDebounceClick() {
      this.debounceCount++
      this.$message.success(`防抖点击成功！当前次数: ${this.debounceCount}`)
    },
    testUtils() {
      // 测试工具函数
      const utils = this.$ppmUtils
      this.utilsResult = {
        deepClone: '深拷贝功能可用',
        deepAssign: '深度合并功能可用',
        utils: Object.keys(utils)
      }
      this.$message.success('工具函数测试完成，查看下方结果')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
}

.header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.demo-card {
  margin-bottom: 20px;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
