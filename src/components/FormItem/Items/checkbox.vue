<template>
  <el-checkbox-group
    class="checkbox"
    :value="data.value"
    v-bind="data"
    v-on="data.on"
  >
    <el-checkbox
      v-for="item of data.options"
      :key="item.label"
      :label="item.value"
      :disabled="item.disabled"
      @click.native.prevent="onCheckboxChange(item)"
    >
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'FormItemCheckbox',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  methods: {
    onCheckboxChange(item) {
      if (item.disabled) return // element-ui 的 bug, 需手动处理 disabled === true 的情况
      const index = this.data.value.findIndex((i) => i === item.value)
      if (index > -1) {
        this.data.value.splice(index, 1)
      } else {
        this.data.value.push(item.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.checkbox {
  height: $formItemHeight;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  ::deep .el-checkbox__label {
    font-size: $fontSize;
    font-weight: normal;
  }
}
</style>
