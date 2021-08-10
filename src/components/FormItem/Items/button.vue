<script>
export default {
  name: 'FormItemButton',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  render: function(h) {
    return this.data.render ? this.data.render(h) : h('el-button', {
      style: this.data.style,
      on: this.data.on,
      props: Object.assign({ size: this.data.size }, this.data.props)
    }, this.data.props.label)
  }
}
</script>
