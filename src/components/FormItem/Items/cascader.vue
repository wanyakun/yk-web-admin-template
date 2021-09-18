<template>
  <el-cascader
    popper-class="el-popper-max-height"
    :class="{cascader: true, 'is-error el-form-item': isError}"
    :value="data.value"
    :props="{
      ...props,
      ...data.props
    }"
    :options="data.options"
    :collapse-tags="data['collapse-tags'] || true"
    :show-all-levels="false"
    v-bind="[{placeholder: '请选择'}, data]"
    @change="onSelecteChange(itemKey, $event)"
    v-on="data.on"
  >
  </el-cascader>
</template>

<script>
export default {
  name: 'FormItemCascader',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  data() {
    return {
      props: { multiple: true }
    }
  },
  methods: {
    onSelecteChange(...props) {
      this.onChange(...props)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.cascader {
  width: $formItemWidth;
  margin-bottom: 0;
}
</style>
