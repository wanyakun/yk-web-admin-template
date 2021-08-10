/* eslint-disable */

const MOBILE = /^1[3|4|5|8|7|9][0-9]\d{8}$/
const EMAIL = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
const MONEY = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
const NAME = /^([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)$/
const PWD = /(\d(?!\d{5})|[A-Za-z](?![A-Za-z]{5})){6}/
const IDCARDNO = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/

export const isRule = (re, value) => {
  if (!value || value.length === 0) {
    return false
  }

  if (!(re instanceof RegExp)) {
    throw new Error('The rule shoud be RegExp')
  }

  if (!re.test(value)) {
    return false
  }
  return true
}

export const isNotEmpty = (data) => {
  return data && (data.length > 0)
}

export const isMobile = (mobile) => {
  return isRule(MOBILE, mobile)
}

export const isEmail = (email) => {
  return isRule(EMAIL, email)
}

export const isMoney = (money) => {
  return isRule(MONEY, money)
}

export const isUsername = (name) => {
  return isRule(NAME, name)
}

export const isPwd = (pwd) => {
  return isRule(PWD, pwd)
}

export const isIdCardNo = (no) => {
  return isRule(IDCARDNO, no)
}

function ltrim(s){
  return s.replace(/(^\s*)/g, "");
}

function rtrim(s){
  return s.replace(/(\s*$)/g, "");
}

function trim(s){
  if (typeof s !== 'string') return s
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

const checkParity = (no) => {
  const len = no.length
  if (len === 18) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let noTemp = 0
    let i
    for (i = 0; i < 17; i += 1) {
      noTemp += no.substr(i, 1) * arrInt[i]
    }
    const valnum = arrCh[noTemp % 11]
    if (valnum === no.substr(17, 1)) {
      return true
    }
    return false
  }
  return true
}

export const isIdCardNoISO = (no) => {
  if (!isNotEmpty(no)) { return false }

  const number = no.toUpperCase()

  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!isIdCardNo(number)) { return false }

  // 校验生日
  // if (!checkBirthday(number)) { return false; }

  // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  if (!checkParity(no)) { return false }

  return true
}

// 如果是函数，返回true说明通过校验
// 如果是正则，test()返回true说明校验通过
const validateRule = {
  _empty: value => value !== undefined && value !== '',
  _emptyArray: value => value !== undefined && value !== '' && value !== null && !!(Array.isArray(value) && value.length),
  _max20: value => value !== undefined && value.length <= 20,
  _max50: value => value !== undefined && value.length <= 50,
  _number: value => !isNaN(value),
  _email: EMAIL,
  _name: /^[\u4e00-\u9fa5a-zA-Z0-9\-_()（）]+$/,
  _p_int: /^[0-9]*[1-9][0-9]*$/,
  _p_int_0: /^\d+$/,
  _int: /^-?\d+$/,
  required: {
    rule: '_empty',
    message: ' '
  },
  name: {
    rule: '_name',
    message: '名称格式不正确'
  },
  mobile: {
    rule: '_mobile',
    message: '手机号格式不正确'
  },
  email: {
    rule: '_email',
    message: '邮箱格式不正确'
  },
  IDCARDNO: {
    rule: '_IDCARDNO',
    message: '身份证格式不正确'
  },
  number: {
    rule: '_number',
    message: '请输入数字'
  }
}

// form表单校验
export function formValidate(value, rules) {
  let message
  value = trim(value)
  rules.find((item) => {
    if (typeof item === 'string') {
      item = validateRule[item]
    }
    let { rule } = item
    let validatePass = false // 是否通过校验
    if (typeof rule === 'string') {
      rule = validateRule[item.rule]
    }
    if (typeof rule === 'function') {
      validatePass = rule.call(this, value)
    } else if (typeof rule === 'object') {
      validatePass = rule.test(value)
    } else {
      throw '校验规则不正确'
    }
    if (validatePass === true) {
      return false
    }
    message = validatePass || item.message
    return true
  })
  return message
}
