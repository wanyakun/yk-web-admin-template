import { parseTime } from '../../utils'

const platformOptions = [
  {
    value: 1,
    label: 'iOS'
  },
  {
    value: 2,
    label: 'Android'
  }
]

const typeOptions = [
  {
    value: 1,
    label: '应用'
  },
  {
    value: 2,
    label: '组件'
  }
]

export default {
  isMountedSearch: true,
  forms: {
    searchForm: [
      {
        key: 'platform',
        type: 'Select',
        data: {
          clearable: true,
          placeholder: '平台',
          options: platformOptions
        }
      },
      {
        key: 'type',
        type: 'Select',
        data: {
          clearable: true,
          placeholder: '类型',
          options: typeOptions
        }
      },
      {
        key: 'name',
        data: {
          placeholder: '名称'
        }
      },
      {
        key: 'search',
        type: 'Button'
      },
      {
        key: 'reset',
        type: 'Button'
      },
      {
        key: 'create',
        type: 'Button',
        interactionType: 'popup'
      },
      {
        key: 'export',
        type: 'Button'
      },
      {
        key: 'clear',
        type: 'Button',
        interactionType: 'popup',
        modalWidth: '700px',
        data: {
          keys: {
            formKey: 'clearForm',
            apiKey: 'clearApi'
          },
          props: {
            label: '清空组件',
            type: 'primary'
          },
          on: {
            click: () => {}
          }
        }
      }
    ],
    addForm: [
      // {
      //   key: 'platform',
      //   type: 'Select',
      //   label: '平台',
      //   data: {
      //     clearable: true,
      //     options: platformOptions
      //   },
      //   rules: [
      //     { required: true, message: '请选择平台', trigger: 'change' }
      //   ]
      // },
      {
        key: 'platform',
        type: 'Radio',
        label: '平台',
        data: {
          defaultValue: 1,
          value: 1,
          options: platformOptions
        }
      },
      {
        key: 'type',
        type: 'Select',
        label: '类型',
        data: {
          clearable: true,
          options: typeOptions
        },
        rules: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      {
        key: 'name',
        label: '名称',
        data: {
          clearable: true
        },
        rules: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      {
        key: 'identifier',
        label: '包名/唯一标示',
        status: false,
        subscribe: {
          key: 'type',
          onCallback(value) {
            this.data.status = (value === 1)
          }
        },
        data: {
          clearable: true
        },
        rules: [
          { required: true, message: '请输入包名或者唯一标示', trigger: 'blur' }
        ]
      },
      {
        key: 'summary',
        label: '概要',
        status: false,
        subscribe: {
          key: 'type',
          onCallback(value) {
            this.data.status = (value === 2)
          }
        },
        data: {
          clearable: true
        }
      },
      {
        key: 'description',
        label: '描述',
        status: false,
        subscribe: {
          key: 'type',
          onCallback(value) {
            this.data.status = (value === 2)
          }
        },
        data: {
          clearable: true
        }
      },
      {
        key: 'git',
        label: '仓库地址',
        data: {
          clearable: true
        },
        rules: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' }
        ]
      },
      {
        key: 'status',
        type: 'Switch',
        label: '状态'
      },
      {
        key: 'author',
        label: '所属者',
        data: {
          clearable: true
        },
        rules: [
          { required: true, message: '请输入所属者', trigger: 'blur' }
        ]
      }// ,
      // {
      //   key: 'app',
      //   type: 'Cascader',
      //   label: '所属应用',
      //   data: {
      //     clearable: true,
      //     props: {
      //       multiple: false
      //     },
      //     placeholder: '请选择所属产品',
      //     options: [
      //       {
      //         value: 1,
      //         label: 'iOS',
      //         children: [
      //           {
      //             value: 10,
      //             label: '应用',
      //             children: [
      //               {
      //                 value: 100,
      //                 label: 'demo10'
      //               },
      //               {
      //                 value: 101,
      //                 label: 'demo11'
      //               },
      //               {
      //                 value: 102,
      //                 label: 'demo12'
      //               }
      //             ]
      //           },
      //           {
      //             value: 11,
      //             label: '组件',
      //             children: [
      //               {
      //                 value: 110,
      //                 label: 'component10'
      //               },
      //               {
      //                 value: 111,
      //                 label: 'component11'
      //               },
      //               {
      //                 value: 112,
      //                 label: 'component12'
      //               }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         value: 2,
      //         label: 'Android',
      //         children: [
      //           {
      //             value: 20,
      //             label: '应用',
      //             children: [
      //               {
      //                 value: 200,
      //                 label: 'demo20'
      //               },
      //               {
      //                 value: 201,
      //                 label: 'demo21'
      //               },
      //               {
      //                 value: 202,
      //                 label: 'demo22'
      //               }
      //             ]
      //           },
      //           {
      //             value: 21,
      //             label: '组件',
      //             children: [
      //               {
      //                 value: 200,
      //                 label: 'component20'
      //               },
      //               {
      //                 value: 201,
      //                 label: 'component21'
      //               },
      //               {
      //                 value: 202,
      //                 label: 'component22'
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // }
      // {
      //   key: 'like',
      //   label: '喜好',
      //   type: 'Checkbox',
      //   data: {
      //     value: [1],
      //     options: [
      //       {
      //         value: 1,
      //         label: '游戏'
      //       },
      //       {
      //         value: 2,
      //         label: '健身'
      //       },
      //       {
      //         value: 3,
      //         label: '音乐'
      //       },
      //       {
      //         value: 4,
      //         label: '爬山'
      //       }
      //     ]
      //   }
      // }
      // {
      //   key: 'insertime',
      //   label: '时间',
      //   type: 'DateTimePicker',
      //   data: {
      //     type: 'datetime',
      //     value: undefined,
      //     placeholder: '选择时间',
      //     'default-time': undefined,
      //     style: {
      //       width: '200px'
      //     }
      //   },
      //   rules: [
      //     { required: true, message: '请选择时间', trigger: 'blur' }
      //   ]
      // },
      // {
      //   key: 'activetime',
      //   label: '活动时间',
      //   type: 'DateTimePicker',
      //   data: {
      //     'start-placeholder': '开始时间',
      //     'end-placeholder': '结束时间',
      //     style: {
      //       width: '200px'
      //     }
      //   }
      // }
      // {
      //   key: 'dropdown',
      //   type: 'Dropdown',
      //   label: '平台',
      //   data: {
      //     btnText: '选择平台',
      //     options: platformOptions
      //   }
      // }
      // {
      //   key: 'customer',
      //   type: 'Render',
      //   label: '自定义组件',
      //   data: {
      //     // value: '自定义组件的Value'
      //     render(h, self) {
      //       return (
      //         <div>hhhh</div>
      //       )
      //     }
      //   }
      // }
    ],
    clearForm: [
      {
        key: 'appIds',
        type: 'Transfer',
        required: true,
        getOptionsApi: {
          path: '/app/currentAuthor',
          labelKey: 'name',
          handleParams(params) {
            return params
          }
        },
        data: {
          titles: ['待选组件', '已选组件']
        },
        rules: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
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
  },
  table: {
    config: {},
    columns: [
      // {
      //   type: 'selection',
      //   width: '55px',
      //   fixed: true
      // },
      // {
      //   type: 'index',
      //   label: '序号',
      //   fixed: true,
      //   width: '100px'
      // },
      {
        prop: 'id',
        label: '编号',
        fixed: 'left'
      },
      {
        prop: 'platform',
        label: '平台',
        map: platformOptions
      },
      {
        prop: 'type',
        label: '类型',
        map: typeOptions
      },
      {
        prop: 'name',
        label: '名称'
      },
      {
        prop: 'identifier',
        label: '标示',
        tooltip: true,
        width: '180px'
      },
      {
        prop: 'summary',
        label: '概要',
        tooltip: true
      },
      // {
      //   prop: 'description',
      //   label: '描述',
      //   tooltip: true
      // },
      // {
      //   prop: 'git',
      //   label: '仓库地址',
      //   tooltip: true
      // },
      {
        prop: 'status',
        label: '状态',
        auto: true
      },
      {
        prop: 'author',
        label: '所属人'
      },
      {
        prop: 'inserttime',
        label: '创建时间',
        render: (value) => parseTime(value),
        width: '140px'
      },
      {
        prop: 'action',
        label: '操作',
        width: '150px',
        fixed: 'right'
      }
    ],
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
            click: (self, { row }) => {
              debugger
              self.$router.push({
                path: '/app/detail/' + row.id
              })
            }
          }
        }
      }
    ]
  },
  variables: {
    platform: {
      key: 'platform',
      value: [
        {
          value: 1,
          label: 'iOS'
        },
        {
          value: 2,
          label: 'Android'
        }
      ]
    },
    type: {
      key: 'type',
      value: [
        {
          value: 1,
          label: '应用'
        },
        {
          value: 2,
          label: '组件'
        }
      ]
    }
  }

}
