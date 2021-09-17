export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {
        userId: 1,
        userName: 'admin',
        token: '12345678901234567890'
      }
    }
  },

  // get user info
  {
    url: '/user/info',
    type: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {
        userId: 1,
        userName: 'admin'
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: {
      code: 1,
      message: 'SUCCESS',
      data: {
      }
    }
  }
]
