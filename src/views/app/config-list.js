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

export const searchForm = [
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
  }
]

export const addForm = [
  {
    key: 'platform',
    type: 'Select',
    label: '平台',
    data: {
      clearable: true,
      options: platformOptions
    },
    rules: [
      { required: true, message: '请选择平台', trigger: 'change' }
    ]
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
  }
]

export const columns = [
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
]
