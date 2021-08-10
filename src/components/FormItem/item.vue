<template>
  <div :is="item" v-bind="itemProp" :isError="isError" @blur="$emit('blur')" @change="$emit('change')"></div>
</template>

<script>
import itemInput from './Items/input'
import itemSelect from './Items/select'
import itemButton from './Items/button'
import itemSwitch from './Items/switch'
export default {
  name: 'FormItemComponent',
  components: {
    itemInput,
    itemSelect,
    itemButton,
    itemSwitch
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
