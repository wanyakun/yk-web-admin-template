import clone from 'clone'
/**
 * vue 中,想要某值双向绑定,必须先主动声明
 * 格式化可能会进行双向绑定的值
 * @param form [formItem]
 * @param cbs [<string<, function>>]
 */
export const formatFormData = (form = [], cbs = []) => {
  const targetForm = clone(form)
  targetForm.forEach((item, index) => {
    if (item.status === undefined) item.status = undefined
    if (!item.data) item.data = {}
    if (item.data.value === undefined) item.data.value = undefined
    if ((item.type === 'Select' || item.type === 'Transfer' || item.type === 'Cascader') && !item.data.options) item.data.options = []

    if (cbs.length) {
      cbs.forEach((cb) => {
        if (typeof cb === 'string') {
          const reg = /^(.*):(.*)$/
          const r = reg.exec(cb)
          const keys = r[1].split('.')
          const value = r[2]
          if (keys.length > 1) {
            let t = item
            keys.forEach((key, index) => {
              if (index === (keys.length - 1)) return
              t[key] = t[key] || {}
              t = t[key]
            })
            const itemKey = keys.pop()
            if (!t[itemKey]) {
              t[itemKey] = value
            }
          } else {
            item[keys[0]] = value
          }
        } else if (typeof cb === 'function') {
          cb(item, index)
        }
      })
    }
  })
  return targetForm
}

export const formatTablePageData = (data = {}) => {
  const { tableConfig, apis, isMountedSearch = true, variables } = data
  if (!data.forms) data.forms = {}
  const { searchForm, createForm } = data.forms
  if (!searchForm) data.forms.searchForm = []
  if (!createForm) data.forms.createForm = []

  if (!tableConfig) data.tableConfig = {}
  const { config, columns, actions } = data.tableConfig
  if (!config) data.tableConfig.config = {}
  if (!columns) data.tableConfig.columns = []
  if (!actions) data.tableConfig.actions = []

  if (!apis) data.apis = {}
  const { searchApi } = data.apis
  if (!searchApi && isMountedSearch) {
    console.error('请配置搜索接口参数 searchApi')
  }

  if (!variables) data.variables = {}
  return data
}
