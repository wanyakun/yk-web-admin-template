import { debounce } from 'lodash'

/**
 * 防抖函数装饰器
 * @param {number} wait 需要延迟的毫秒数
 * @param {object} options 选项对象
 * [options.leading=false] (boolean): 指定在延迟开始前调用。
 * [options.maxWait] (number): 设置 func 允许被延迟的最大值。
 * [options.trailing=true] (boolean): 指定在延迟结束后调用。
 * @returns {Function}
 */
export default function(wait, options = {}) {
  return function(target, name, descriptor) {
    descriptor.value = debounce(descriptor.value, wait, options)
  }
}
