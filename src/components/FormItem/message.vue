<template>
  <div class="message">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormItemMessage',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables";
.message {
  line-height: $fontSize;
  font-size: $fontSize;
  color: $error;
}
</style>
