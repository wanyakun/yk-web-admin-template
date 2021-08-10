<template>
  <div v-show="data.status !== false" class="item" :style="data.style">
    <item-container v-bind="containerProps" :label="data.label" :max-label-width="maxLabelWidth">
      <div class="right">
        <div v-if="data.render" class="value" v-html="data.render(data)"></div>
        <form-item-component v-else v-bind="itemProps" :is-error="validateState === 'error'" @blur="onBlur" @change="onChange"></form-item-component>
        <form-item-message v-if="validateState === 'error'" class="message">{{ validateMessage }}</form-item-message>
      </div>
    </item-container>
  </div>
</template>

<script>

import ItemContainer from './Container/index'
import FormItemComponent from './item'
import FormItemMessage from './message'
import { noop } from '../../utils'
import AsyncValidator from 'async-validator'
import objectAssign from '../../utils/merge'

export default {
  name: 'FormItem',
  components: { FormItemMessage, FormItemComponent, ItemContainer },
  props: ['data', 'maxLabelWidth', 'size'],
  data() {
    const { data } = this.data
    data.size = this.size
    return {
      validateState: '',
      validateMessage: ''
    }
  },
  computed: {
    isRequired() {
      const { rules } = this.data
      let isRequired = false

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    },
    containerProps() {
      const { labelType, labelStyle } = this.data
      return {
        type: labelType,
        labelStyle,
        required: this.isRequired
      }
    },
    itemProps() {
      const { key, type, data } = this.data
      return {
        itemKey: key,
        type,
        data,
        isError: (this.validateState === 'error')
      }
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      const { key, status } = this.data
      if (status === false) {
        callback()
        return true
      }
      const rules = this.getFilteredRule(trigger)
      // const required = !!rules.find((item) => item.required)

      if ((!rules || rules.length === 0) && !this.isRequired) {
        callback()
        return true
      }
      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger
        })
      }
      descriptor[key] = rules
      const validator = new AsyncValidator(descriptor)
      const model = {}
      const { value } = this.data.data
      model[key] = value
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''
        callback(this.validateMessage, invalidFields)
      })
    },
    onBlur() {
      const { onBlur = noop } = this.data.data
      this.validate('blur')
      onBlur()
    },
    onChange(value) {
      const { onChange = noop } = this.data.data
      this.validate('change')
      onChange(value)
    },
    setErrorMessage(message) {
      if (message && message !== '') {
        this.validateState = 'error'
      }
      this.validateMessage = message
    },
    clearValidatedMessage() {
      this.validateState = 'success'
      this.setErrorMessage('')
    },
    onChangeStatus(status = this.data.status !== false) {
      this.data.status = status
    },
    getFilteredRule(trigger) {
      const { rules = [] } = this.data
      return rules.filter(rule => {
        if (!rule.trigger || trigger === '') return true
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      }).map(rule => objectAssign({}, rule))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.right {
  position: relative;
}
.message {
  position: absolute;
  bottom: -14px;
  margin-top: 2px;
}
.value {
  line-height: $formItemHeight;
}
</style>
