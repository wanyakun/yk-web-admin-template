import { Loading, Message } from 'element-ui'

/**
 * 通用网络请求处理中心
 * @param needMessage 是否需要错误信息
 * @param needLoading 是否需要展示loading
 * @param needError 是否需要向外层抛错
 * @param needLogin 是否需要登录
 * @returns {function(*, *, *): *}
 */
export function exception({ needMessage = false, needLoading = false, needError = true } = {}) {
  return function(target, name, descriptor) {
    const originFun = descriptor.value
    descriptor.value = async function(...args) {
      let loading = null
      try {
        // 根据需要显示loading
        if (needLoading) {
          loading = Loading.service({
            fullscreen: true
          })
        }
        // 网络请求发出
        const res = await originFun.apply(this, args).catch(e => {
          throw e
        })
        // 处理请求结果
        if (res.result === 1) {
          if (res.hasOwnProperty('resultContent')) {
            return res.resultContent
          } else {
            return undefined
          }
        } else {
          throw res || {}
        }
      } catch (e) {
        // 根据需要弹错误提示
        if (needMessage) {
          // 取消登录的错误不需要抛出
          if (e.code && e.code === -999999) {
            // 根据需要向外层跑错
            if (needError) {
              throw e
            } else {
              return
            }
          }
          if (typeof (needMessage) === 'string') {
            Message.error(needMessage)
          } else {
            const msg = e.resultMessage || '网络异常，请稍后重试'
            msg && Message.error(msg)
          }
        }
        // 根据需要向外层跑错
        if (needError) {
          throw e
        }
      } finally {
        // 根据需要隐藏loading
        if (needLoading) {
          if (this.$nextTick) {
            this.$nextTick(() => {
              loading.close()
            })
          } else {
            loading.close()
          }
        }
      }
    }
    return descriptor
  }
}
