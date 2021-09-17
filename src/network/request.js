import axios from '../network'
import { Loading, Message } from 'element-ui'

export class Request {
  url
  params
  config
  needLoading = false
  needMessage = false
  needError = false

  constructor(url, params, config = {}) {
    this.url = url
    this.params = params
    this.config = config
  }

  showLoading(show) {
    this.needLoading = show
    return this
  }

  showMessage(show) {
    this.needMessage = show
    return this
  }

  useError(use) {
    this.needError = use
    return this
  }

  async start() {
    let loading
    let data
    try {
      // 根据需要显示loading
      if (this.needLoading) {
        loading = Loading.service({
          fullscreen: true
        })
      }
      const res = await axios.post(this.url, { ...this.params }, this.config).catch((e) => {
        throw e
      })
      const code = res && res.code
      if (code === 1) {
        data = res.data
      } else if (code === 4001) {
        // 参数非法，根据是否显示message决定是否显示error
        if (this.needMessage) {
          Message.error(res && res.message)
        }
      } else if (code === 4002) {
        // TODO：无权限访问，跳转到无权限页面
      } else if (code === '4003') {
        // TODO：认证失败，如果是登录接口，显示Error，如果是其他接口，跳转到登录页
      } else if (code === 9999) {
        if (this.needMessage) {
          Message.error('系统错误异常')
        }
      } else {
        throw res || {}
      }
    } catch (e) {
      // 根据需要弹错误提示
      if (this.needMessage) {
        const msg = e.message || '网络异常，请稍后重试'
        msg && Message.error(msg)
      }
      // 根据需要向外层跑错
      if (this.needError) {
        throw e
      }
    } finally {
      // 根据需要隐藏loading
      if (this.needLoading) {
        if (this.$nextTick) {
          this.$nextTick(() => {
            loading.close()
          })
        } else {
          loading.close()
        }
      }
    }
    return data
  }
}
