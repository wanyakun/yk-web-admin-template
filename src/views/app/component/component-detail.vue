<template>
  <div class="component-detail-container">
    这里是组件详情
  </div>
</template>

<script>
export default {
  name: 'ComponentDetail',
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.component-detail-container {
}
</style>
