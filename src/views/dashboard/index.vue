<template>
  <div class="dashboard-container">
    <div class="dashboard-text">我的应用</div>
    <div class="app-list">
      <el-card
        v-for="app of appList"
        :key="app.id"
        class="app-box-card"
      >
        <div slot="header" class="box-header">
          <div class="app-name">
            <svg-icon :icon-class="app.platform === 1 ? 'ios' : 'android'" />
            <router-link class="name" :to="{ path:'/app/detail/' + app.id }"> {{ app.name }}</router-link>
          </div>
          <div class="app-build">
            <el-button type="text" size="small" style="float: right; padding: 3px 0">构建管理</el-button>
          </div>
        </div>
        <div class="box-body">
          <p>编号：{{ app.id }}</p>
          <p>名称：{{ app.name }}</p>
          <p v-if="app.type === 1">标示：{{ app.identifier }}</p>
          <p v-else-if="app.type === 2">概要：{{ app.summary }}</p>
          <p>仓库：{{ app.git }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loading } from '../../decorator'
import AppApi from '../../api/app'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'Dashboard',
  components: {
    SvgIcon
  },
  data() {
    return {
      appList: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getAppList()
  },
  methods: {
    @loading()
    async getAppList() {
      this.appList = await AppApi.appOfCurrentUser()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    /*margin: 30px;*/
  }
  &-text {
    font-size: 15px;
  }
}
.app {
  &-list {
    display: flex;
    flex-wrap: wrap;
  }
  &-box-card {
    width: 315px;
    height: 220px;
    margin: 15px;
    .box-header {
      display: flex;
    }
    .box-body {
      padding: 18px 20px;
      p {
        padding-top: 5px;
        font-size: 12px;
        color: #606266;
      }
    }
  }
  &-name {
    display: flex;
    flex: 1;
    height: 20px;
    line-height: 20px;
    .name {
      margin-left: 10px;
      font-size: 12px;
      color: #303133;
    }
  }
  &-build {
    text-align: right;
  }
}
</style>
