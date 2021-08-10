<template>
  <div class="detail-container">
    <div :is="detail" v-if="app" :detail="app" />
  </div>
</template>

<script>
import AppApi from '../../api/app'
import AppDetail from './component/app-detail'
import ComponentDetail from './component/component-detail'

export default {
  name: 'Detail',
  components: { ComponentDetail, AppDetail },
  data() {
    return {
      app: undefined
    }
  },
  computed: {
    detail() {
      if (this.app === undefined) {
        return 'AppDetail'
      } else {
        return this.app.type === 1 ? 'AppDetail' : 'ComponentDetail'
      }
    }
  },
  created() {
    this.getAppDetail()
  },
  methods: {
    async getAppDetail() {
      const appId = this.$route.params.id
      this.app = await AppApi.appDetail({ id: appId })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
}
</style>
