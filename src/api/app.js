import { Request } from '@/network/request'

class AppApi {
  async appOfCurrentUser(params) {
    const request = new Request('/app/currentAuthor', params)
    return await request.start()
  }

  async appDetail(params) {
    const request = new Request('/app/detail', params)
    return await request.start()
  }
}

export default new AppApi()
