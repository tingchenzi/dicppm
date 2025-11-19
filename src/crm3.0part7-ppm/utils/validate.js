export function isvalidUsername(str) {
  // const valid_map = ['admin', 'test']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length >= 3
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
// 手机号验证
export function validatePhone1(str) {
  const reg = /^1(3|4|5|7|8)\d{9}$/
  return reg.test(str)
}
// 邮箱验证
export function validateEmail(str) {
  const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  return reg.test(str)
}
// 身份证号验证
export function validateId(str) {
  const reg = /^[1-9]\d{7}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str)
}
//数字
export function validNum(str) {
  const reg = /^[0-9]*$/
  return reg.test(str)
}

//中文
export function validateChinese(value) {
  const reg = /[\u4e00-\u9fa5]/
  return reg.test(value);
}

//正整数
export function validIntNum(str) {
  const reg = /^[1-9]\d*$/
  return reg.test(str)
}

//double
export function validDoubleNum(str) {
  const reg = /^[0-9,.]*$/
  return reg.test(str)
}

export function validatePhone(rule, value, callback) {
  const reg = /^[1][3-9][0-9]{9}$/; 
  if (value == '' || value == undefined || value == null) { 
    callback("请输入手机号"); 
  } else { 
    if ((!reg.test(value)) && value != '') { 
      callback(new Error(rule.message)); 
    } else { 
      callback(); 
    } 
  }
}
