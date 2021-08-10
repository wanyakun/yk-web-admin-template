import { MessageBox } from 'element-ui'

/**
 * 确认提示框装饰器
 * @param message 提示信息
 * @param title 标题
 * @param cancelFun 取消回调函数
 * @returns {Function}
 */
export function confirm(message = '请确认', title = '提示', cancelFun = () => {}) {
  return function(target, name, descriptor) {
    const originFun = descriptor.value
    descriptor.value = function(...rest) {
      try {
        MessageBox.confirm(message, title, {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          originFun.apply(this, rest)
        })
      } catch (e) {
        cancelFun() && cancelFun(e)
      }
    }
  }
}

/**
 * 提示框装饰器
 * @param message
 * @param title
 * @returns {Function}
 */
export function alert(message = '', title = '提示') {
  return function(target, name, descriptor) {
    const originFun = descriptor.value
    descriptor.value = function(...rest) {
      MessageBox.alert(message, title, {
        confirmButtonText: '确认'
      }).then(() => {
        originFun.apply(this, rest)
      })
    }
  }
}
