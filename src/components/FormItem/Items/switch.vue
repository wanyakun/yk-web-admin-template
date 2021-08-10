<template>
  <el-switch
    :value="data.value"
    v-bind="[data]"
    @change="(value) => onChange(itemKey, value)"
  />
</template>

<script>
export default {
  name: 'FormItemSwitch',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError']
}
</script>
