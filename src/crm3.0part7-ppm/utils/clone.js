/* 类型判断 */
export function checkType(data) {
    // 用来判断被拷贝对象数据类型的函数
    return Object.prototype.toString.call(data).slice(8, -1)
  }
  /**
   * @param {any} source
   * @returns {Object}
   */
  
  export function deepClone(source) {
    // 实现深度拷贝的函数
    let result,
      sourceType = checkType(source)
    if (sourceType === 'Object') {
      // 只有对象和数组才进行深度拷贝
      result = {}
    } else if (sourceType === 'Array') {
      result = []
    } else {
      return source
    }
    for (let i in source) {
      // i为对象的key或数组的下标
      let value = source[i]
      let valueType = checkType(value)
      if (valueType === 'Object' || valueType === 'Array') {
        // 当拷贝的对象中还有数组或是对象时进行递归，克隆它们中的内容，直到递归完所有数组或对象为止
        result[i] = deepClone(value)
      } else {
        result[i] = value
      }
    }
    return result // 返回最终的结果
  }
  
  /**
   * @param {Object} FirstOBJ,SecondOBJ
   * @returns {Object}
   */
  export function deepAssign(FirstOBJ, SecondOBJ) {
    // 深度合并对象
    for (var key in SecondOBJ) {
      FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]' ? deepAssign(FirstOBJ[key], SecondOBJ[key]) : (FirstOBJ[key] = SecondOBJ[key])
    }
    return FirstOBJ
  }
  