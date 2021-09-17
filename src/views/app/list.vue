<template>
  <div class="list-container">
    <table-page ref="tableList" :data="tableListData" />
  </div>
</template>

<script>

import TablePage from '../../components/Table/TablePage'
import config from './list.config'

export default {
  name: 'List',
  components: { TablePage },
  data() {
    return {
      tableListData: config
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  .searchForm {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
