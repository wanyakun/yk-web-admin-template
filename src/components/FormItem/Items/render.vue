<script>
export default {
  name: 'FormItemRender',
  inject: ['onChange'],
  props: ['itemKey', 'data', 'isError'],
  render: function(h) {
    return (
      this.data.render ? this.data.render(h, this) : h('div', {
        'class': 'default'
      }, this.data.value)
    )
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables";

.default {
  line-height: $formItemHeight;
  font-size: $fontSize;
  color: #616161;
}
</style>
