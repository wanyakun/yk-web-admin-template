import { Request } from '@/network/request'

class UserApi {
  async login(params) {
    const request = new Request('/user/login', params)
    return await request.showMessage(true).start()
  }

  async getInfo(params) {
    const request = new Request('/user/info', params)
    return await request.showMessage(true).start()
  }

  async logout(params) {
    const request = new Request('/user/logout', params)
    return await request.showMessage(true).start()
  }
}

export default new UserApi()
