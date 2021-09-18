<template>
  <div :is="item" v-bind="itemProp" :is-error="isError" @blur="$emit('blur')" @change="$emit('change')" />
</template>

<script>
import itemButton from './Items/button'
import itemCascader from './Items/cascader'
import itemCheckbox from './Items/checkbox'
import itemDateTimePicker from './Items/dataTimePicker'
import itemDropdown from './Items/dropdown'
import itemInput from './Items/input'
import itemRadio from './Items/radio'
import itemRender from './Items/render'
import itemSelect from './Items/select'
import itemSwitch from './Items/switch'
import itemTransfer from './Items/transfer'

export default {
  name: 'FormItemComponent',
  components: {
    itemButton,
    itemCascader,
    itemCheckbox,
    itemDateTimePicker,
    itemDropdown,
    itemInput,
    itemRadio,
    itemRender,
    itemSelect,
    itemSwitch,
    itemTransfer
  },
  inheritAttrs: true,
  props: ['type', 'itemKey', 'data', 'isError'],
  data() {
    const { itemKey, data, isError } = this
    return {
      item: `item${this.type || 'Input'}`,
      itemProp: {
        itemKey,
        data,
        isError
      }
    }
  }
}
</script>
