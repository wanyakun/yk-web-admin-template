<template>
  <el-select
    :class="{select: true, 'is-error el-from-item': isError}"
    :value="data.value"
    v-bind="[{placeholder: '请选择'}, data]"
    @change="onSelectChange(itemKey, $event)"
  >
    <el-option
      v-for="item in data.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FormItemSelect',
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
.select {
  width: $formItemWidth;
  margin-bottom: 0;
}
</style>
