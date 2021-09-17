<template>
  <div :class="{'line': data.line}">
    <el-transfer
      filterable
      v-model="data.value"
      :data="data.options.map((item) => ({ ...item, key: item.value }))"
      v-bind="[{'filter-placeholder': '请输入'}, data]"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'FormItemTransfer',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.input {
  width: $formItemWidth;
  margin-bottom: 0;
}
.line {
  &:before {
    content: '-';
    font-size: $fontSize;
    display: inline-block;
    width: 12px;
    text-align: center;
  }
}
</style>
