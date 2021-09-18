<template>
  <el-radio-group
    class="radio"
    :value="data.value"
    v-bind="data"
  >
    <el-radio
      v-for="item of data.options"
      :key="item.label"
      :label="item.value"
      :disabled="item.disabled"
      @click.native.prevent="onRadioChange(item)"
    >
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'FormItemRadio',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  methods: {
    onRadioChange(item) {
      if (item.disabled) return
      this.onChange(this.itemKey, item.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.radio {
  height: $formItemHeight;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  ::v-deep .el-radio__label {
    font-size: $fontSize;
    font-weight: normal;
  }
}
</style>
