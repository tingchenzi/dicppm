/**
 * 从原项目复制源代码到插件项目
 * 
 * 使用方法:
 * node scripts/copy-source.js
 */

const fs = require('fs-extra')
const path = require('path')

// 源目录（原项目中的 PPM 模块）
const SOURCE_DIR = path.resolve(__dirname, '../../crm3.0-Enterprise/src/crm3.0part7-ppm')

// 目标目录（插件项目中的源码目录）
const TARGET_DIR = path.resolve(__dirname, '../src/crm3.0part7-ppm')

async function copySource() {
  try {
    console.log('开始复制源代码...')
    console.log(`源目录: ${SOURCE_DIR}`)
    console.log(`目标目录: ${TARGET_DIR}`)

    // 检查源目录是否存在
    if (!fs.existsSync(SOURCE_DIR)) {
      console.error(`❌ 源目录不存在: ${SOURCE_DIR}`)
      console.log('请确保路径正确，或手动复制文件')
      process.exit(1)
    }

    // 确保目标目录存在
    fs.ensureDirSync(TARGET_DIR)

    // 复制整个目录
    await fs.copy(SOURCE_DIR, TARGET_DIR, {
      overwrite: true,
      filter: (src) => {
        // 排除不需要的文件
        const relativePath = path.relative(SOURCE_DIR, src)
        
        // 排除 node_modules
        if (relativePath.includes('node_modules')) {
          return false
        }
        
        // 排除构建产物
        if (relativePath.includes('build/dist')) {
          return false
        }
        
        // 排除 dic-crm3ppm-ui 目录（避免循环）
        if (relativePath.includes('dic-crm3ppm-ui')) {
          return false
        }
        
        return true
      }
    })

    console.log('✅ 源代码复制完成！')
    console.log('\n接下来的步骤:')
    console.log('1. 检查复制的文件是否完整')
    console.log('2. 运行 npm install 安装依赖')
    console.log('3. 运行 npm run build 构建插件')
    console.log('4. 运行 npm run dev 查看示例')
    
  } catch (error) {
    console.error('❌ 复制失败:', error.message)
    process.exit(1)
  }
}

// 执行复制
copySource()
