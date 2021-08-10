export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: {
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: {
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
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: {
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
      result: 1,
      resultMessage: 'SUCCESS',
      resultContent: {
      }
    }
  }
]
