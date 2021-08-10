const apps = [
  {
    id: 1,
    platform: 1,
    type: 1,
    name: 'demo',
    identifier: 'com.demo.demo',
    summary: 'this is summary',
    description: 'this is description',
    git: 'https://github.com/demo/demo.git',
    status: 1,
    author: 'admin',
    inserttime: 123123123
  },
  {
    id: 2,
    platform: 1,
    type: 2,
    name: 'demo1',
    identifier: 'com.demo.demo1',
    summary: 'this is summary',
    description: 'this is description',
    git: 'https://github.com/demo/demo1.git',
    status: 1,
    author: 'admin',
    inserttime: 123123123
  },
  {
    id: 3,
    platform: 2,
    type: 1,
    name: 'demo2',
    identifier: 'com.demo.demo2',
    summary: 'this is summary',
    description: 'this is description',
    git: 'https://github.com/demo/demo2.git',
    status: 1,
    author: 'admin',
    inserttime: 123123123
  }
]

export default [
  {
    url: '/app/currentAuthor',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: apps
    }
  },
  {
    url: '/app/findByPage',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 3,
        data: apps
      }
    }
  },
  {
    url: '/app/add',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: []
    }
  },
  {
    url: '/app/update',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: []
    }
  },
  {
    url: '/app/delete',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: []
    }
  },
  {
    url: '/app/export',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: []
    }
  },
  {
    url: '/app/detail',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: apps[0]
    }
  }
]
