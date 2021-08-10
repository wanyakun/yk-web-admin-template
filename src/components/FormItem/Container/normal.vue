<template>
  <div class="normal-container">
    <p
      v-if="label !== undefined"
      :key="label"
      :data-test="label"
      :class="{label: true, required}"
      :style="[{width:maxLabelWidth + 'px'}, labelStyle]"
    >{{ label }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NormalContainer',
  inheritAttrs: false,
  props: ['label', 'maxLabelWidth', 'labelStyle', 'required']
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.normal-container {
  display: flex;
}
.label {
  color: #343434;
  flex-shrink: 0;
  font-size: 12px;
  margin-right: 12px;
  height: $formItemHeight;
  line-height: $formItemHeight;
}
.required::after {
  content: ' *';
  color: #F56C6C;
  font-size: 12px;
  transform: scale(0.833);
}
</style>
