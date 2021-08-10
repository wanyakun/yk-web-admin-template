<template>
  <div class="form" :class="{horizontal: type === 'horizontal'}">
    <!-- eslint-disable-next-line -->
    <form-item
      v-for="item of formData"
      ref="form"
      :key="item.key"
      :size="size"
      :class="{horizontal: type === 'horizontal', vertical: type === 'vertical'}"
      :data="item"
      :max-label-width="maxLabelWidth"
    >
    </form-item>
    <slot />
  </div>
</template>

<script>
import FormItem from '../FormItem/index'
import request from '@/network/request'
import objectAssign from '../../utils/merge'

const actions = {
  show() {
    this.data.status = true
  },
  hide() {
    this.data.status = false
  },
  clear() {
    this.data.data.value = undefined
  },
  getOptions(value) {
    this.$parent.getOptionsFromApi(this.data.key, { id: value })
  }
}

export default {
  name: 'CustomForm',
  components: { FormItem },
  props: {
    data: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'horizontal'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      publisher: [],
      getOptions: [],
      apis: {}
    }
  },
  provide() {
    // 注入到 每一个formItem中，每个处理没个formItem的内容变化
    const self = this
    return {
      onChange(...props) {
        self.onChange(...props)
      }
    }
  },
  computed: {
    maxLabelWidth() {
      let maxNameLength = 0
      const charWidth = 12
      const requiredIconWidth = 12
      this.data.forEach((item) => {
        if (!item.label) return
        maxNameLength = Math.max(item.label.length, maxNameLength)
      })
      return maxNameLength * charWidth + requiredIconWidth
    },
    formData() {
      this.data.forEach((item) => {
        // 订阅
        if (item.subscribe) {
          const target = Array.isArray(item.subscribe) ? item.subscribe : [item.subscribe]
          target.forEach(i => {
            if (typeof i.key === 'string') {
              this.publisher.push({
                ...i,
                subscriber: item.key
              })
            } else if (Array.isArray(i.key)) {
              i.key.forEach((j) => {
                this.publisher.push({
                  ...i,
                  key: j,
                  subscriber: item.key
                })
              })
            }
          })
        }
        if (item.publish) {
          const target = Array.isArray(item.publish) ? item.publish : [item.publish]
          target.forEach(i => {
            if (typeof i.key === 'string') {
              this.publisher.push({
                ...i,
                key: item.key,
                subscriber: i.key
              })
            } else if (Array.isArray(i.key)) {
              i.key.forEach((j) => {
                this.publisher.push({
                  ...i,
                  key: item.key,
                  subscriber: j
                })
              })
            }
          })
        }
        if (item.getOptionsApi) {
          if (typeof item.getOptionsApi === 'string') item.getOptionsApi = { path: item.getOptionsApi }
          if (item.getOptionsApi.actionType && item.getOptionsApi.actionType !== 'mounted') {
            this.apis[item.key] = item.getOptionsApi
          } else {
            this.getOptions.push({
              ...item.getOptionsApi,
              key: item.key,
              label: item.label
            })
          }
        }
      })
      return this.data
    }
  },
  mounted() {
    if (this.getOptions.length) {
      this.getOptionsFromApis()
    }
  },
  methods: {
    onChangeStatus() {
      this.$refs.form.forEach((item) => {
        item.onChangeStatus()
      })
    },
    onMatchCallback(callback, subscriber, value) {
      if (!callback) return
      if (Array.isArray(callback)) {
        return callback.forEach((item) => {
          this.onMatchCallback(item, subscriber, value)
        })
      }
      if (typeof callback === 'string' && callback.indexOf('=>') < 0) {
        actions[callback].call(subscriber, value)
      } else {
        this.execStringOrFunction(callback, subscriber, value)
      }
    },
    onChange(...props) {
      if (this.publisher.length) {
        this.publisher.forEach((item) => {
          // key 与 itemKey对应
          if (item.key === props[0]) {
            const subscriber = this.$refs.form.find((i) => i.data.key === item.subscriber)
            if (item.match) {
              if (this.execStringOrFunction(item.match, subscriber, props[1])) {
                this.onMatchCallback(item.success, subscriber, props[1])
              } else {
                this.onMatchCallback(item.error, subscriber, props[1])
              }
              this.onMatchCallback(item.finally, subscriber, props[1])
            } else if (item.onCallback) {
              this.onMatchCallback(item.onCallback, subscriber, props[1])
            }
          }
        })
      }
      // 通知form的回调
      this.$emit('onCallback', ...props)
    },
    getOptionsFromApis() {
      this.getOptions.forEach((item) => {
        const { handleResult, valueKey = 'id', labelKey = 'name', handleOptions } = item
        const callback = (result) => {
          let targetResult = result
          const target = this.data.find(i => i.key === item.key)
          // 需要多options结果进行二次加工处理
          if (handleOptions) {
            const options = handleOptions.call(this, targetResult, target)
            target.data.options = options
          } else {
            if (handleResult) {
              targetResult = handleResult.call(this, targetResult, target)
            }
            target.data.options = targetResult.map((i) => ({ value: i[valueKey], label: i[labelKey] }))
          }
          target.getOptionsApi.result = targetResult
        }
        this.sendApi(item, callback)
      })
    },
    getOptionsFromApi(key, params = {}) {
      const api = this.apis[key]
      if (!api) return
      const { handleResult, valueKey = 'id', labelKey = 'name' } = api
      const success = (result) => {
        let targetResult = result
        const target = this.data.find(i => i.key === key)
        if (handleResult) {
          targetResult = handleResult.call(this, targetResult, target)
        }
        target.data.options = targetResult.map((i) => ({ value: i[valueKey], label: i[labelKey] }))
        target.getOptionsApi.result = targetResult
      }
      this.sendApi(api, success, params)
    },
    /** 工具方法 **/
    execStringOrFunction(func, self, value) {
      if (typeof func === 'function') {
        return func.call(self, value)
      }
      return eval(func)
    },
    async sendApi(api, callback, params = {}) {
      const { path = '', handleParams = data => data } = api
      const targetParams = handleParams.call(this, params)
      const result = await request.post(path, targetParams)
      callback(result)
    },
    // validate() {
    //   let isPass = true
    //   this.$refs.form.forEach((item) => {
    //     if (item.data.status === false || item.data.ignore === true) return
    //     if (!item.validate()) {
    //       isPass = false
    //     }
    //   })
    //   return isPass
    // },
    validate(callback) {
      let promise
      // 没有回调，返回一个promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }
      if (this.formData.length === 0 && callback) {
        callback(true)
      }
      let valid = true
      let count = 0
      let invalidItems = {}
      this.$refs.form.forEach((item) => {
        // if (item.data.status === false || item.data.ignore === true) {
        //   count++
        //   return
        // }
        item.validate('', (message, item) => {
          if (message) {
            valid = false
          }
          invalidItems = objectAssign({}, invalidItems, item)
          if (typeof callback === 'function' && ++count === this.formData.length) {
            callback(valid, invalidItems)
          }
        })
      })

      if (promise) {
        return promise
      }
    },
    /** 清理Form下每个Item的验证信息 **/
    clearValidatedMessage() {
      this.$refs.form.forEach((item) => {
        item.clearValidatedMessage()
      })
    },
    /** 设置错误信息 */
    setErrorMessage(key, message) {
      const item = this.$refs.form.find((item) => item.data.key === key) || {}
      item.setErrorMessage(message)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .horizontal {
    margin-right: 12px;
    margin-bottom: 12px;
  }
  .vertical {
    margin-bottom: 18px;
  }
}
.horizontal {
  display: flex;
  flex-wrap: wrap;
}
</style>
