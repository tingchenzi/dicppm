/**
 * API 服务层
 * 通过适配器模式解耦具体实现，方便不同项目接入
 */

class ApiService {
  constructor() {
    this.adapter = null
  }

  /**
   * 设置 API 适配器
   * @param {Object} adapter - API 适配器对象
   */
  setAdapter(adapter) {
    if (!adapter || typeof adapter !== 'object') {
      throw new Error('[dic-crm3ppm-ui] Invalid API adapter. Expected an object.')
    }
    this.adapter = adapter
    console.log('[dic-crm3ppm-ui] API adapter set successfully.')
  }

  /**
   * 检查适配器是否已设置
   * @private
   */
  _checkAdapter() {
    if (!this.adapter) {
      throw new Error(
        '[dic-crm3ppm-ui] API adapter not set. Please call Vue.use(DicPPM, { apiAdapter }) first.'
      )
    }
  }

  /**
   * 调用适配器方法
   * @private
   * @param {String} methodName - 方法名
   * @param {Array} args - 参数
   */
  async _callAdapter(methodName, ...args) {
    this._checkAdapter()
    
    if (!this.adapter[methodName]) {
      throw new Error(
        `[dic-crm3ppm-ui] Method "${methodName}" not implemented in API adapter.`
      )
    }

    try {
      return await this.adapter[methodName](...args)
    } catch (error) {
      console.error(`[dic-crm3ppm-ui] API call failed: ${methodName}`, error)
      throw error
    }
  }

  /**
   * 获取订单信息
   * @param {Object} params - 查询参数
   */
  async getOrderInfo(params) {
    return await this._callAdapter('getOrderInfo', params)
  }

  /**
   * 保存表单数据
   * @param {Object} data - 表单数据
   */
  async saveForm(data) {
    return await this._callAdapter('saveForm', data)
  }

  /**
   * 执行 SQL 查询
   * @param {Object} params - SQL 参数
   */
  async executeSql(params) {
    return await this._callAdapter('executeSql', params)
  }

  /**
   * 获取产品信息
   * @param {Object} params - 查询参数
   */
  async getProductInfo(params) {
    return await this._callAdapter('getProductInfo', params)
  }

  /**
   * 查询字典数据
   * @param {Object} params - 查询参数
   */
  async getDictData(params) {
    return await this._callAdapter('getDictData', params)
  }

  /**
   * 通用请求方法
   * @param {Object} config - 请求配置
   */
  async request(config) {
    return await this._callAdapter('request', config)
  }

  /**
   * 获取可选包列表
   * @param {Object} params - 查询参数
   */
  async getOptionalPackages(params) {
    return await this._callAdapter('getOptionalPackages', params)
  }

  /**
   * 获取产品实例信息
   * @param {Object} params - 查询参数
   */
  async getProductInstance(params) {
    return await this._callAdapter('getProductInstance', params)
  }
}

// 导出单例
export default new ApiService()
