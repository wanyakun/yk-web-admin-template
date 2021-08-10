import request from '@/network/request'
import { exception } from '../decorator'

class UserApi {
  @exception({ needMessage: true })
  async login(params) {
    const data = await request.post('/user/login', params)
    return data
  }

  @exception({ needMessage: true })
  async getInfo(params) {
    const data = await request.post('/user/info', params)
    return data
  }

  @exception({ needMessage: true })
  async logout(params) {
    const data = await request.post('/user/logout', params)
    return data
  }
}

export default new UserApi()
