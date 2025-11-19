/**
 * PPM API 适配器示例
 * 
 * 这个文件展示了如何创建 API 适配器来对接你的后端服务
 * 请根据你的实际项目修改这些方法的实现
 */

// 导入你项目中的 API 服务
// import OrderService from '@/api/order/OrderService'
// import phoneOrderServe from '@/api/order/phoneOrderServe'

export default {
  /**
   * 获取订单信息
   * @param {Object} params - 查询参数
   * @returns {Promise} 订单信息
   */
  async getOrderInfo(params) {
    // 示例实现
    console.log('getOrderInfo called with params:', params)
    
    // 实际项目中应该这样实现:
    // return await OrderService.getOrderInfo(params)
    
    // 示例返回
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: {
        orderId: '123456',
        orderStatus: '1000'
      }
    }
  },

  /**
   * 保存表单数据
   * @param {Object} data - 表单数据
   * @returns {Promise} 保存结果
   */
  async saveForm(data) {
    console.log('saveForm called with data:', data)
    
    // 实际项目中应该这样实现:
    // return await phoneOrderServe.saveForm(data)
    
    return {
      meta: {
        resCode: '0',
        resMsg: '保存成功'
      }
    }
  },

  /**
   * 执行 SQL 查询
   * @param {Object} params - SQL 参数
   * @param {String} params.interFaceType - 接口类型
   * @param {String} params.sqlId - SQL ID
   * @param {String} params.paramStr - 参数字符串
   * @returns {Promise} 查询结果
   */
  async executeSql(params) {
    console.log('executeSql called with params:', params)
    
    // 实际项目中应该这样实现:
    // return await OrderService.executeSql(params)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success',
        resList: {
          executeSqlResps: []
        }
      }
    }
  },

  /**
   * 获取产品信息
   * @param {Object} params - 查询参数
   * @returns {Promise} 产品信息
   */
  async getProductInfo(params) {
    console.log('getProductInfo called with params:', params)
    
    // 实际项目中应该这样实现:
    // return await OrderService.getProductInfo(params)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: {
        productId: params.productId,
        productName: '示例产品'
      }
    }
  },

  /**
   * 查询字典数据
   * @param {Object} params - 查询参数
   * @returns {Promise} 字典数据
   */
  async getDictData(params) {
    console.log('getDictData called with params:', params)
    
    // 实际项目中应该这样实现:
    // return await OrderService.getDictData(params)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: []
    }
  },

  /**
   * 通用请求方法
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  async request(config) {
    console.log('request called with config:', config)
    
    // 实际项目中应该这样实现:
    // return await OrderService.request(config)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: null
    }
  },

  /**
   * 获取可选包列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 可选包列表
   */
  async getOptionalPackages(params) {
    console.log('getOptionalPackages called with params:', params)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: []
    }
  },

  /**
   * 获取产品实例信息
   * @param {Object} params - 查询参数
   * @returns {Promise} 产品实例信息
   */
  async getProductInstance(params) {
    console.log('getProductInstance called with params:', params)
    
    return {
      meta: {
        resCode: '0',
        resMsg: 'success'
      },
      data: {
        prodInstId: params.prodInstId
      }
    }
  }
}
