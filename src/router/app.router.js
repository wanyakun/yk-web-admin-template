import Layout from '@/layout'

export default [
  {
    path: '/app',
    component: Layout,
    name: 'App',
    meta: { title: '应用管理', icon: 'eye' },
    children: [
      {
        path: 'list',
        name: 'AppList',
        component: () => import('@/views/app/list'),
        meta: { title: '应用列表', icon: 'sendpoints' }
      },
      {
        path: 'detail/:id',
        name: 'AppDetail',
        component: () => import('@/views/app/detail'),
        meta: { title: '应用详情', icon: 'sendpoints' },
        hidden: true
      }
    ]
  }
]
