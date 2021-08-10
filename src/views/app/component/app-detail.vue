<template>
  <div class="app-detail-container">
    这里是app详情
  </div>
</template>

<script>
export default {
  name: 'AppDetail',
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
.app-detail-container {
}
</style>
