<template>
  <div class="table-page">
    <custom-form ref="searchForm" :data="searchForm" :size="size" @onCallback="onSearchFormChange" />
    <el-table
      ref="table"
      v-loading="loading"
      :class="{ 'table-top': searchForm.length > 0 }"
      :size="size"
      v-bind="data.table.config"
      :data="dataSource"
      row-key="id"
      @selection-change="$emit('selection-change', $event)"
    >
      <template v-for="column of data.table.columns">
        <!-- 选择 -->
        <el-table-column v-if="column.type === 'selection'" :key="column.label" v-bind="column" />
        <!-- 其他 -->
        <el-table-column v-else :key="column.label" v-bind="column">
          <template v-slot="scope">
            <!-- 序号 -->
            <template v-if="scope.column.type === 'index'">{{ scope.$index + 1 }}</template>
            <!-- 状态滑块 -->
            <template v-if="(scope.column.property === 'status' || column.actionType === 'status') && column.auto">
              <el-switch :value="scope.row[scope.column.property]" @change="updateStatus(scope.row)" />
            </template>
            <!-- 其他 -->
            <template v-else-if="scope.column.property !== 'action'">
              <!-- tooltip -->
              <template v-if="column.tooltip">
                <el-tooltip :open-delay="300" effect="dark" :content="scope.row[scope.column.property]" placement="top">
                  <div class="tooltipContent lib-ellipsis" :style="{'max-width': column.maxWidth, display: 'inline-block'}">{{ scope.row[scope.column.property] }}</div>
                </el-tooltip>
              </template>
              <template v-else-if="column.map">{{ (column.map.find((item) => item.value === scope.row[scope.column.property]) || {}).label }}</template>
              <template v-else>{{ column.render ? column.render(scope.row[scope.column.property]) : scope.row[scope.column.property] }}</template>
            </template>
            <!-- 操作按钮 -->
            <div v-else>
              <template v-for="btn of tableActions">
                <el-button :key="btn.key" :size="size" v-bind="btn.data.props" @click="onActionButtonClick(btn, scope)">
                  {{ typeof btn.data.props.label === 'string' ? btn.data.props.label: '' }}
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="currentPage" :limit.sync="pageSize" @pagination="onSearch" />
    <!-- 弹窗 -->
    <el-dialog
      class="dialog-show-title"
      :visible.sync="dialogVisible"
      :width="dialogForm.modalWidth"
      :append-to-body="true"
      :show-close="false"
      @close="onClosedDialog"
    >
      <div class="dialog-title">{{ dialogForm.title }}</div>
      <custom-form
        v-if="dialogForm.type === 'popup'"
        :key="dialogForm.key"
        ref="dialogForm"
        class="dialog-form"
        type="vertical"
        :size="size"
        :data="dialogForm.form"
        @onCallback="onDialogFormChange"
      />
      <div v-if="dialogForm.type === 'confirm'" class="dialog-content">
        <i class="el-icon-warning" style="color: #e6a23c; font-size: 18px;margin-right: 8px;" />
        {{ dialogForm.content }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogVisible = false">取 消</el-button>
        <el-button :size="size" type="primary" @click="onDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import CustomForm from '../Form/index'
import clone from 'clone'
import Pagination from '../Pagination/index'
import { Request } from '@/network/request'
import { formatFormData } from '../../utils/tools'

const callbacks = {
  onSearch() {
    this.onSearch()
  },
  message(params) {
    // const label = typeof this.commonForm.label === 'string' ? this.commonForm.label : this.commonForm.label(params)
    // this.$message.success(`${label}成功`)
  }
}

export default {
  name: 'TablePage',
  components: { Pagination, CustomForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      searchForm: [],
      dataSource: [],
      variables: {},
      variablesOptions: [],
      currentPage: 1,
      pageSize: 10,
      loading: false,
      total: 0,
      dialogVisible: false,
      dialogForm: {
        id: undefined,
        form: [],
        key: undefined,
        title: undefined,
        content: undefined,
        type: 'popup',
        row: {},
        modalWidth: '352px',
        onCallback: {}
      }
    }
  },
  computed: {
    tableActions() {
      const defaultBtn = {
        edit: {
          keys: {
            formKey: 'addForm',
            apiKey: 'updateApi'
          },
          props: {
            label: '编辑',
            type: 'text'
          },
          on: {
            click: () => {},
            callback: this.onSearch
          }
        },
        delete: {
          keys: {
            apiKey: 'deleteApi'
          },
          props: {
            label: '删除',
            type: 'text'
          },
          on: {
            click: () => {},
            callback: this.onSearch
          }
        },
        status: {
          props: {
            label: (row) => row.status ? '禁用' : '启用',
            type: 'primary'
          },
          on: {
            click: ({ row }) => this.updateStatus(row)
          }
        }
      }
      return this.data.table.actions.map((item) => {
        const data = defaultBtn[item.key]
        if (data) {
          item.data = Object.assign(data, item.data)
        }
        const { interactionType } = item
        if (interactionType) {
          this.setInteractionForItem(item, 'actions')
        }
        return item
      })
    }
  },
  watch: {
    data() {
      this.applyOptions()
    }
  },
  created() {
    this.applyOptions()
  },
  mounted() {
    this.data.isMountedSearch && this.onSearch()
  },
  methods: {
    /** 初始化 **/
    applyOptions() {
      this.handleVariables()
      this.handleForm(this.searchForm, 'searchForm')
    },
    handleVariables() {
      if (!this.data.variables) return
      Object.keys(this.data.variables).forEach((item) => {
        const { apiKey, value, handleResult = data => data } = this.data.variables[item]
        if (apiKey) {
          const result = this.sendApi(this.data.apis[apiKey])
          const targetResult = this.execStringOrFunction(handleResult, result)
          this.variablesOptions.forEach(({ variableKey, handleResult: handleResult2, key, type, valueKey = 'value', labelKey = 'label' }) => {
            if (variableKey === item) {
              let options
              if (handleResult2) {
                options = this.execStringOrFunction(handleResult2, targetResult)
              } else {
                options = targetResult.map((i) => ({ value: i[valueKey], label: i[labelKey] }))
              }
              this.setOptions(type, key, options)
            }
          })
          this.variables[item] = targetResult
        } else {
          this.variables[item] = value
        }
      })
    },
    handleForm(form, key) {
      if (Array.isArray(this.data.forms[key])) {
        const defaultBtn = {
          search: {
            props: {
              label: '搜索',
              icon: 'el-icon-search',
              type: 'primary'
            },
            on: {
              click: this.onSearch
            }
          },
          reset: {
            props: {
              label: '重置',
              type: 'primary'
            },
            on: {
              click: this.onReset
            }
          },
          create: {
            keys: {
              formKey: 'addForm',
              apiKey: 'createApi'
            },
            props: {
              label: '新增',
              type: 'primary'
            },
            on: {
              click: () => {},
              callback: this.onSearch
            }
          },
          export: {
            keys: {
              apiKey: 'exportApi'
            },
            props: {
              label: '导出',
              type: 'primary'
            },
            on: {
              click: this.onExport
            }
          }
        }
        const cloneForm = clone(this.data.forms[key])
        const targetForm = this.handleFormOptions(cloneForm, key)
        targetForm.forEach((item) => {
          if (item.status === undefined) item.status = undefined
          if (!item.data) item.data = {}
          if (item.data.value === undefined) item.data.value = undefined
          if ((item.type === 'Select' || item.type === 'Transfer' || item.type === 'Cascader') && !item.data.options) item.data.options = []
          if (item.type === 'Button') {
            item.data = defaultBtn[item.key] || item.data
            const { interactionType } = item
            if (interactionType) {
              this.setInteractionForItem(item, 'button')
            }
          }
        })
        if (!form) {
          form = []
        }
        form.push(...targetForm)
      }
    },
    handleFormOptions(form, key) {
      return form.map(item => {
        const { getOptionsApi, getOptionsFromVariables } = item
        if (getOptionsApi && getOptionsApi.apiKey) {
          item.getOptionApi = Object.assign(getOptionsApi, this.data.apis[getOptionsApi.apiKey]) // 实际请求是在From中
        } else if (getOptionsFromVariables && getOptionsFromVariables.variableKey) {
          // 变量中获取options，直接组装
          const variable = this.variables[getOptionsFromVariables.variableKey]
          if (!variable) {
            this.variablesOptions.push({
              type: key,
              key: item.key,
              ...getOptionsFromVariables
            })
          } else {
            const { handleResult, valueKey = 'value', labelKey = 'label' } = getOptionsFromVariables
            let options
            if (handleResult) {
              options = this.execStringOrFunction(handleResult, variable)
            } else {
              options = variable.map((i) => ({ value: i[valueKey], label: i[labelKey] }))
            }
            item.data.options = options
          }
        }
        return item
      })
    },
    /** 搜索查询 **/
    onSearch() {
      // 搜索
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.doSearch()
        }
      })
    },
    async doSearch() {
      // 搜索
      const { searchApi } = this.data.apis
      const { path, handleResult } = searchApi
      const targetParams = this.getSearchTargetParams()
      this.loading = true
      const request = new Request(path, targetParams)
      const result = await request.start().finally(this.loading = false)
      let targetResult = { data: [], total: 0 }
      if (handleResult) {
        targetResult = this.execStringOrFunction(handleResult, result)
      } else {
        targetResult.data = result.data
        targetResult.total = result.totalCount
      }
      this.dataSource = targetResult.data
      this.total = targetResult.total
    },
    getSearchTargetParams() {
      const { handleParams = data => data } = this.data.apis.searchApi
      return this.execStringOrFunction(handleParams, this.getSearchParams())
    },
    getSearchParams() {
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      this.searchForm.forEach((item) => {
        const { value } = item.data
        if ((item.key === 'time' || item.handleKey === 'time') && Array.isArray(value) && value.length) {
          const { handleValue = [] } = item
          const startKey = handleValue[0] || 'startTime'
          const endKey = handleValue[1] || 'endTime'
          params[startKey] = dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss')
          params[endKey] = dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')
        } else if (!item.ignore && item.status !== false) {
          if (item.handleFormValue) {
            this.execStringOrFunction(item.handleFormValue, item.key, this.getValue(value), params)
          } else {
            params[item.key] = this.getValue(value)
          }
        }
      })
      return params
    },
    onSearchFormChange(key, value) {
      if (this.$listeners.onSearchFormChange) {
        const self = this
        this.$emit('onSearchFormChange', key, value, function(key, value) {
          const item = self.searchForm.find(item => item.key === key)
          item.data.value = value
        })
      } else {
        const item = this.searchForm.find(item => item.key === key)
        item.data.value = value
      }
    },
    /** 重置 **/
    onReset() {
      // 重置
      console.log('onReset')
      this.onResetForm(this.searchForm, this.data.forms.searchForm)
      this.currentPage = 1
      this.pageSize = 10
      this.onSearch()
    },
    async onExport() {
      // 导出
      const { exportApi } = this.data.apis
      const { path = exportApi } = exportApi
      const targetParams = this.getSearchTargetParams()
      delete targetParams.pageNo
      delete targetParams.pageSize
      const request = new Request(path, targetParams, { responseType: 'blob' })
      await request.start()
      this.$message.success('导出成功')
    },
    onResetForm(form, data) {
      form.forEach((item) => {
        if (item.type === 'Button') return
        const target = data.find(i => i.key === item.key)
        const { value } = target.data
        item.status = target.status
        item.data.value = value
      })
    },
    // 为按钮绑定事件
    setInteractionForItem(item, from) {
      const { interactionType, label = item.data.props.label, content, modalWidth = '480px', applyRowData = true } = item
      const { apiKey, formKey } = item.data.keys
      const { callback = () => {} } = item.data.on
      if (interactionType === 'api') {
        // 设置网络请求
        item.data.on.click = async(data = { row: {}}) => {
          const params = from === 'actions' ? data.row : this.getSearchTargetParams()
          const { path = this.data.apis[apiKey] } = this.data.apis[apiKey]
          const request = new Request(path, params)
          await request.start()
          if (callback) {
            this.execStringOrFunction(callback, params)
          }
        }
      } else if (interactionType === 'popup') {
        // 设置弹窗
        item.data.on.click = (data = { row: {}}) => {
          this.dialogForm.label = label
          this.dialogForm.title = label
          this.dialogForm.apiKey = apiKey
          this.dialogForm.onCallback = callback
          this.dialogForm.from = from
          if (this.dialogForm.key !== formKey) {
            this.dialogForm.type = 'popup'
            this.dialogForm.form = this.handleFormOptions(formatFormData(this.data.forms[formKey]), 'dialogForm')
            this.dialogForm.key = formKey
            this.dialogForm.modalWidth = modalWidth
          }
          if (from === 'actions') {
            // 代表是table中行的操作
            this.dialogForm.id = data.row.id
            this.dialogForm.row = data.row
            if (applyRowData) {
              this.dialogForm.form.forEach((i) => {
                if (data.row[i.key] !== undefined) {
                  if (i.handleSetValue) {
                    i.data.value = i.handleSetValue.call(this, data.row[i.key], data.row)
                  } else {
                    i.data.value = data.row[i.key]
                  }
                }
              })
            }
          }
          this.dialogVisible = true
          const self = this
          this.dialogForm.form.forEach((item) => {
            self.$nextTick(() => {
              self.$refs.dialogForm.onChange(item.key, item.data.value)
            })
          })
        }
      } else if (interactionType === 'confirm') {
        // 设置二次确认框
        item.data.on.click = (data = { row: {}}) => {
          this.dialogForm.label = label
          this.dialogForm.type = 'confirm'
          this.dialogForm.key = undefined
          this.dialogForm.title = label
          this.dialogForm.content = content
          this.dialogForm.apiKey = apiKey
          this.dialogVisible = true
          this.dialogForm.modalWidth = '420px'
          this.dialogForm.onCallback = callback
          this.dialogForm.from = from
          if (from === 'actions') {
            this.dialogForm.id = data.row.id
            this.dialogForm.row = data.row
          }
        }
      }
    },
    // 修改table中某一行的状态
    async updateStatus(data) {
      const { updateApi = {}, statusUpdateApi } = this.data.apis
      const targetApi = statusUpdateApi || updateApi
      const { path = targetApi, handleParams = data => data, handleResult } = targetApi
      data.status = !data.status
      const targetParams = this.execStringOrFunction(handleParams, data)
      const request = new Request(path, targetParams)
      const result = await request.start()
      let targetResult = result
      if (handleResult) {
        targetResult = this.execStringOrFunction(handleResult, result)
      }
      if (targetResult.result === 1) {
        this.$message.success('操作成功')
      }
    },
    // table中按钮点击
    onActionButtonClick(btn, row) {
      btn.data.on.click(this, row)
    },
    /** 弹窗相关 **/
    onDialogFormChange(key, value) {
      const item = this.dialogForm.form.find(item => item.key === key)
      if (item && item.data) {
        item.data.value = value
      }
    },
    onDialogFormSubmit() {
      // 弹窗提交按钮点击
      let target = {}
      if (this.dialogForm.type === 'popup') {
        // 弹窗确认
        target = this.getFormValue(this.dialogForm.form)
        target.id = this.dialogForm.id
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.dialogFormDoSubmit(target)
          }
        })
      } else {
        if (this.dialogForm.from === 'actions') {
          // 行操作
          target = this.dialogForm.row
        } else {
          target = this.getSearchTargetParams()
        }
        this.dialogFormDoSubmit(target)
      }
    },
    async dialogFormDoSubmit(target) {
      const { path, handleParams = props => props, handleResult } = this.data.apis[this.dialogForm.apiKey]
      const targetParams = this.execStringOrFunction(handleParams, target)
      const request = new Request(path, targetParams)
      const result = await request.start()
      let targetResult = result
      if (handleResult) {
        targetResult = this.execStringOrFunction(handleResult, result)
      }
      if (targetResult.result === 1) {
        this.$message.success('操作成功')
      }

      this.dialogVisible = false
      this.execStringOrFunction(this.dialogForm.onCallback)
    },
    onClosedDialog() {
      // 弹窗关闭后处理的内容
      // 确认弹窗，不需要处理
      if (this.dialogForm.type === 'confirm') return
      // 重置弹窗form表单
      this.onResetForm(this.dialogForm.form, formatFormData(this.data.forms[this.dialogForm.key]))
      this.$refs.dialogForm && this.$refs.dialogForm.clearValidatedMessage()
      this.dialogForm.id = undefined
    },
    /** tool method **/
    async sendApi(api, params = {}) {
      if (!api) return
      const { path = api, handleParams = data => data, handleResult = result => result, success = () => {}, error = () => {} } = api
      const targetParams = this.execStringOrFunction(handleParams, params)
      const request = new Request(path, targetParams)
      const result = await request.start().catch((err) => {
        this.execStringOrFunction(error, err)
      })
      const targetResult = this.execStringOrFunction(handleResult, result)
      this.execStringOrFunction(success, targetResult)
      return targetResult
    },
    execStringOrFunction(func, params, ...r) { // 需要将params单独声明，在 eval 的函数中会使用
      if (typeof func === 'function') {
        return func.call(this, params, ...r)
      } else if (typeof func === 'string' && func.indexOf('=>') < 0) {
        return callbacks[func].call(this, params, ...r)
      } else if (Array.isArray(func)) {
        func.forEach((item) => {
          this.execStringOrFunction(item, params, ...r)
        })
        return
      }
      return eval(func) // 如果是字符串函数时通过 eval 执行，注意XXS攻击
    },
    setOptions(type, key, options) {
      const item = this[type].find((item) => item.key === key) || { data: {}}
      item.data.options = options
    },
    getValue(value) {
      return ((value !== undefined && value !== '') || (Array.isArray(value) && value.length)) ? value : undefined
    },
    getFormValue(form) {
      const target = {}
      form.forEach((item) => {
        const { value } = item.data
        if (item.status === false || item.ignore === true) return
        if (item.handleFormValue) {
          this.execStringOrFunction(item.handleFormValue, item.key, this.getValue(value), target)
        } else {
          target[item.key] = this.getValue(value)
        }
      })
      return target
    }
  }
}
</script>

<style lang="scss" scoped>
.table-top {
  margin-top: 20px;
}
.dialog-title {
  padding: 20px;
  font-size: 14px;
  font-weight: bold;
}
.dialog-content {
  padding: 0 20px;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.tooltipContent {
  margin: auto
}
.dialog-show-title {
  & ::v-deep.el-dialog__body {
    padding: 0;
  }
  .dialog-form {
    padding: 0 40px 20px;
  }
  ::v-deep .el-dialog__header {
    padding: 0;
  }
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
}
</style>
