<template>
  <div :is="itemContainer" :label="label" :max-label-width="maxLabelWidth" :label-style="labelStyle" :required="required">
    <slot />
  </div>
</template>

<script>
import NormalContainer from './normal'
export default {
  name: 'ItemContainer',
  components: {
    NormalContainer
  },
  props: ['type', 'label', 'maxLabelWidth', 'labelStyle', 'required'],
  data() {
    return {
      itemContainer: this.type || 'normal-container'
    }
  }
}
</script>
