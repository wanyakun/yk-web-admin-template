<template>
  <el-dropdown @command="onChange(itemKey, $event)">
    <el-button type="primary" size="mini">
      {{ data.btnText }}
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of data.options" :key="item.label" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'FormItemDropdown',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError']
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.input {
  width: $formItemWidth;
  margin-bottom: 0;
}
</style>
