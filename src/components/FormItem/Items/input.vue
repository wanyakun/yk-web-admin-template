<template>
  <div :class="{'line': data.line, 'suffixLine': data.suffixLine}">
    <el-input
      :class="{input: true, 'is-error el-form-item': isError}"
      :value="data.value"
      @input="onInputChange(itemKey, $event)"
      v-bind="[{placeholder: '请输入'}, data]"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script>
export default {
  name: 'FormItemInput',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  methods: {
    onInputChange(...props) {
      this.onChange(...props)
      this.$emit('change')
    }
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
.suffixLine {
  &::after {
    content: '-';
    font-size: $fontSize;
    display: inline-block;
    width: 12px;
    text-align: center;
  }
}
</style>
