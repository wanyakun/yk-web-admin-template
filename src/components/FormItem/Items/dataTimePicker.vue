<template>
  <el-date-picker
    :class="{input: true, 'is-error el-form-item': isError}"
    :value="data.value"
    v-bind="[{'start-placeholder': '开始日期', 'end-placeholder': '结束日期', 'default-time': ['00:00:00', '23:59:59'], type: 'datetimerange'}, data]"
    @blur="$emit('blur')"
    @input="onSelectChange(itemKey, $event)"
  ></el-date-picker>
</template>

<script>
export default {
  name: 'FormItemDataTimePicker',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  methods: {
    onSelectChange(...props) {
      this.onChange(...props)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.input {
  margin-bottom: 0;
}
.is-error.el-form-item {
  border-color: $error;
}
</style>
