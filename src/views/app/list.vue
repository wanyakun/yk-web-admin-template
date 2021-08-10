<template>
  <div class="list-container">
    <table-page ref="tableList" :data="tableListData" />
  </div>
</template>

<script>

import { searchForm, addForm, columns } from './config-list'
import TablePage from '../../components/Table/TablePage'

const tableListData = (self) => ({
  isMountedSearch: true,
  forms: {
    searchForm,
    addForm
  },
  table: {
    config: {},
    columns,
    actions: [
      {
        key: 'edit',
        type: 'Button',
        interactionType: 'popup'
      },
      {
        key: 'delete',
        type: 'Button',
        interactionType: 'confirm',
        content: '确认删除该应用？'
      },
      {
        key: 'config',
        data: {
          props: {
            label: '查看详情',
            type: 'text'
          },
          on: {
            click: ({ row }) => {
              self.$router.push({
                path: '/app/detail/' + row.id
              })
            }
          }
        }
      }
    ]
  },
  apis: {
    searchApi: {
      path: '/app/findByPage',
      handleParams(params) {
        return params
      }
    },
    createApi: {
      path: '/app/add',
      handleParams(params) {
        return params
      }
    },
    updateApi: {
      path: '/app/update'
    },
    exportApi: {
      path: '/app/export'
    },
    deleteApi: {
      path: '/app/delete',
      handleParams(params) {
        return { id: params['id'] }
      }
    }
  }
})

export default {
  name: 'List',
  components: { TablePage },
  data() {
    return {
      tableListData: tableListData(this)
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
