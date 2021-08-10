import { Loading } from 'element-ui'

export function loading(message = '加载中...', errorFun = () => {}) {
  return function(target, name, descriptor) {
    const fun = descriptor.value
    descriptor.value = async function(...rest) {
      const loading = Loading.service({
        fullscreen: true,
        text: message
      })
      try {
        return await fun.call(this, ...rest)
      } catch (e) {
        errorFun && errorFun.call(this, e, ...rest)
      } finally {
        this.$nextTick(() => {
          loading.close()
        })
      }
    }
  }
}
